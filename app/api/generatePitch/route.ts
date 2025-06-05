import { NextRequest } from "next/server";
import { convertJsonToCSV, parseCSV } from "@/src/utils/csvUtils";
import { processLeadsPipeline } from "@/src/functions/pipeline";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Function to send updates to the client
  const sendUpdate = async (type: string, data: any) => {
    const update = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    await writer.write(encoder.encode(JSON.stringify(update) + '\n'));
  };

  // Process in background while returning stream
  (async () => {
    try {
      const formData = await request.formData();
      const csvFile = formData.get('file') as File;
      const companyContext = formData.get('companyContext') as string;
      const maxGroups = Number(formData.get('maxGroups')) || 3;
      const predefinedGroupsStr = formData.get('predefinedGroups') as string;
      const predefinedGroups = predefinedGroupsStr?.trim() 
        ? predefinedGroupsStr.split(',').map(g => g.trim()).filter(Boolean)
        : undefined;
      
      const csvData = await parseCSV(csvFile);
      type ProcessedLead = typeof csvData[0] & {
        id: string;
        groupName: string;
        pitch: string;
      };

      // Send initial status
      await sendUpdate('start', {
        totalLeads: csvData.length,
        maxGroups,
        predefinedGroups
      });

      // Process leads with progress callback
      const pipelineResult = await processLeadsPipeline({
        leads: csvData,
        companyContext,
        maxGroups,
        predefinedGroups,
        onProgress: async (update: any) => {
          await sendUpdate('progress', update);
        },
        onLeadProcessed: async (lead: ProcessedLead) => {
          await sendUpdate('lead', lead);
        },
        onGroupCreated: async (group: { name: string; description: string; }) => {
          await sendUpdate('group', group);
        }
      }) as ProcessedLead[];

      // Generate CSV for final download
      const csvResult = convertJsonToCSV(pipelineResult);
      await sendUpdate('csv', { content: csvResult });

      // Send completion status
      await sendUpdate('complete', {
        totalProcessed: pipelineResult.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Send error if something goes wrong
      await sendUpdate('error', {
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}