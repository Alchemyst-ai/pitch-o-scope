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
  
  // Generate CSV for download
  const csvResult = convertJsonToCSV(pipelineResult);
  
  // Extract only the needed fields for UI display
  const uiData = pipelineResult.map(lead => ({
    id: lead.id,
    fullName: lead['Full Name'] || `${lead['First Name'] || ''} ${lead['Last Name'] || ''}`.trim(),
    jobTitle: lead['Job Title'] || '',
    companyName: lead['Company Name'] || '',
    groupName: lead.groupName || '',
    pitch: lead.pitch || ''
  }));
  
  // Return JSON response with both CSV and UI data
  return NextResponse.json({
    csv: csvResult,
    results: uiData
  });
}