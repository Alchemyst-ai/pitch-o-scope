import { generate } from "./utils/generate";
import { v4 as uuidv4 } from "uuid";
import { parseUntilJson } from "./utils/parseUntilJson";

interface Lead {
  [key: string]: any;
  id?: string;
}

interface Group {
  name: string;
  description: string;
  leadIds: string[];
}

function ensureUniqueIds(leads: Lead[]): Lead[] {
  return leads.map(lead => ({
    ...lead,
    id: lead.id || uuidv4(),
  }));
}

function batchArray<T>(arr: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batches.push(arr.slice(i, i + batchSize));
  }
  return batches;
}

export async function processLeadsPipeline({
  leads,
  companyContext,
}: {
  leads: Lead[];
  companyContext: string;
}): Promise<Lead[]> {
  const leadsWithIds = ensureUniqueIds(leads);

  const batches = batchArray(leadsWithIds, 10);

  let groups: Group[] = [];
  const leadToGroup: Record<string, string> = {};

  for (const batch of batches) {
    const prompt = `Analyze these leads and classify them into groups based on our company context.

Company Context:
${companyContext}

Guidelines:
- Do not use any specific lead data in the group descriptions. For example, none of the group descriptions should mention or be tailored to one specific lead or company. REMEMBER THIS.
- Group descriptions must be general enough to apply to any company in the group, not just one.
- BAD EXAMPLE (do NOT do this): "<Your company name> can offer specialized services to Company A, focusing on..."
- GOOD EXAMPLE (do this): "<Your company name> can offer specialized services for companies in the <group name> sector, focusing on..."
- The purpose of these groups is to help us craft tailored sales outreach messages to the leads.
- Each group should represent a distinct angle or approach our company can use to help or provide value to the leads in that group.
- Create groups that are relevant and meaningful within the context of our company and our offerings.
- Avoid making groups that are too specific or granular; each group should represent a significant, actionable category for sales outreach, not a trivial distinction.
- Make sure the group descriptions are general enough that they can be used for a wide range of leads.
- Prefer broader, business-relevant groupings that would help our company take action or make decisions.
- If unsure, err on the side of fewer, more general groups rather than many highly specific ones.

Existing Groups:
${
  groups.length === 0
    ? "No groups created yet"
    : groups.map((g) => `${g.name}: ${g.description}`).join("\n")
}

Leads to Classify:
${JSON.stringify(batch, null, 2)}

Return a JSON array of objects with this structure:
[
  {
    "leadId": "string",
    "groupName": "string",
    "groupDescription": "string (only if creating new group, describe the sales angle or value proposition for this group)"
  }
]
  
# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON ARRAY.`;

    const llmResponse = await generate(prompt);

    let assignments: Array<{ leadId: string; groupName: string; groupDescription?: string }> = [];
    try {
      assignments = parseUntilJson(llmResponse) as Array<{ leadId: string; groupName: string; groupDescription?: string }>;
    } catch (e) {
      throw new Error("Failed to parse LLM response: " + llmResponse);
    }

    for (const { leadId, groupName, groupDescription } of assignments) {
      leadToGroup[leadId] = groupName;
      let group = groups.find(g => g.name === groupName);
      if (!group) {
        groups.push({
          name: groupName,
          description: groupDescription || "",
          leadIds: [leadId],
        });
      } else {
        group.leadIds.push(leadId);
      }
    }
  }

  const groupPitches: Record<string, string> = {};
  for (const group of groups) {
    const pitchPrompt = `You are a world-class B2B sales copywriter. Please follow these instructions:
- Write a fully polished, highly personalized, and actionable sales pitch that is ready to use as-is.
- Do NOT include any placeholders, template language, or generic sections.
- Do NOT reference the group, recipient, or their company anywhere in the pitch.
- The pitch should NOT be in the form of an email, letter, or message—just a paragraphed, engaging, and insightful description of the value and services offered.
- Only talk about our company and its offerings, tailored to the needs and context of the group.
- Make every part specific, relevant, and complete.
- End with a strong, relevant call to action that encourages immediate engagement.

Company Context: ${companyContext}
Relevant Services/Angle: ${group.name} - ${group.description}`;
    const pitch = await generate(pitchPrompt);
    groupPitches[group.name] = pitch.trim();
  }

  const modifiedLeads = leadsWithIds.map(lead => {
    const groupName = leadToGroup[lead.id!];
    return {
      ...lead,
      groupName,
      pitch: groupPitches[groupName] || "",
    };
  });

  return modifiedLeads;
}


