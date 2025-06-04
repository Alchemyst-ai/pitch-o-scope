import { NextRequest, NextResponse } from "next/server";
import { convertJsonToCSV, parseCSV } from "@/src/utils/csvUtils";
import { processLeadsPipeline } from "@/src/functions/pipeline";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const csvFile = formData.get('file') as File;
  const companyContext = formData.get('companyContext') as string;
  const csvData = await parseCSV(csvFile);
  type ProcessedLead = typeof csvData[0] & {
    id: string;
    groupName: string;
    pitch: string;
  };
  const pipelineResult = await processLeadsPipeline({
    leads: csvData,
    companyContext,
  }) as ProcessedLead[];
  const csvResult = convertJsonToCSV(pipelineResult);
  return new Response(csvResult, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="output.csv"',
    },
  });
}