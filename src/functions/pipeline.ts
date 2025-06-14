import { generate } from "./utils/generate";
import { v4 as uuidv4 } from "uuid";
import { parseUntilJson } from "./utils/parseUntilJson";

interface Lead {
  [key: string]: any;
  id?: string;
}

interface ProcessedLead extends Lead {
  id: string;
  groupName: string;
  pitch: string;
}

interface Group {
  name: string;
  description: string;
  leadIds: string[];
}

interface PipelineCallbacks {
  onProgress?: (update: any) => Promise<void>;
  onLeadProcessed?: (lead: ProcessedLead) => Promise<void>;
  onGroupCreated?: (group: {
    name: string;
    description: string;
  }) => Promise<void>;
}

function ensureUniqueIds(leads: Lead[]): Lead[] {
  return leads.map((lead) => ({
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

async function mergeGroups(
  groups: Group[],
  companyContext: string
): Promise<Group[]> {
  if (groups.length <= 1) return groups;
  let mergeInfo: {
    group1: string;
    group2: string;
    newGroupName: string;
    newGroupDescription: string;
  } | null = null;
  try {
    const prompt = `Analyze these groups and suggest how to merge the two most similar groups into one broader group.

Company Context:
${companyContext}

Current Groups:
${groups.map((g) => `${g.name}: ${g.description}`).join("\n")}

Return a JSON object with this structure (pick the two most similar groups):
{
  "group1": "name of first group to merge",
  "group2": "name of second group to merge",
  "newGroupName": "name for merged group",
  "newGroupDescription": "broader description that encompasses both groups"
}

# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON OBJECT.`;
    const llmResponse = await generate(prompt);
    mergeInfo = parseUntilJson(llmResponse) as {
      group1: string;
      group2: string;
      newGroupName: string;
      newGroupDescription: string;
    };
  } catch (e) {
    console.error("Error merging groups:", e);
    return groups;
  }
  if (!mergeInfo) return groups;
  const group1 = groups.find((g) => g.name === mergeInfo!.group1);
  const group2 = groups.find((g) => g.name === mergeInfo!.group2);
  if (!group1 || !group2) {
    console.error("Could not find groups to merge");
    return groups;
  }
  const mergedGroup: Group = {
    name: mergeInfo.newGroupName,
    description: mergeInfo.newGroupDescription,
    leadIds: [...group1.leadIds, ...group2.leadIds],
  };
  return [
    ...groups.filter(
      (g) => g.name !== mergeInfo!.group1 && g.name !== mergeInfo!.group2
    ),
    mergedGroup,
  ];
}

async function generateGroupDescriptions(
  groupNames: string[],
  companyContext: string
): Promise<Group[]> {
  let groupDescriptions: Array<{ name: string; description: string }> = [];
  try {
    const prompt = `Given these group names, generate meaningful descriptions for each group in the context of our company's offerings.

Company Context:
${companyContext}

Group Names:
${groupNames.join("\n")}

Guidelines:
- Create descriptions that explain how our company can provide value to companies in each group
- Make descriptions general enough to apply to any company in the group
- Focus on the business value and relevance of each group
- Keep descriptions concise but specific

Return a JSON array of objects with this structure:
[
  {
    "name": "group name",
    "description": "group description"
  }
]

# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON ARRAY.`;
    const llmResponse = await generate(prompt);
    groupDescriptions = parseUntilJson(llmResponse) as Array<{
      name: string;
      description: string;
    }>;
  } catch (e) {
    console.error("Error generating group descriptions:", e);
    groupDescriptions = groupNames.map((name) => ({ name, description: "" }));
  }
  return groupDescriptions.map((group) => ({
    name: group.name,
    description: group.description,
    leadIds: [],
  }));
}

async function classifyLeadsIntoExistingGroups(
  leads: Lead[],
  groups: Group[],
  companyContext: string
): Promise<Array<{ leadId: string; groupName: string }>> {
  try {
    const prompt = `Classify these leads into the existing groups based on our company context.

Company Context:
${companyContext}

Available Groups:
${groups.map((g) => `${g.name}: ${g.description}`).join("\n")}

Leads to Classify:
${JSON.stringify(leads, null, 2)}

Return a JSON array of objects with this structure:
[
  {
    "leadId": "string",
    "groupName": "string (must be one of the existing group names)"
  }
]

# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON ARRAY.`;
    const llmResponse = await generate(prompt);
    return parseUntilJson(llmResponse) as Array<{
      leadId: string;
      groupName: string;
    }>;
  } catch (e) {
    console.error("Error classifying leads into existing groups:", e);
    return leads.map((lead) => ({
      leadId: lead.id!,
      groupName: groups[0]?.name || "Unassigned",
    }));
  }
}

async function reclassifyUnassignedLeads(
  unassignedLeads: Lead[],
  groups: Group[],
  companyContext: string
): Promise<Array<{ leadId: string; groupName: string }>> {
  if (unassignedLeads.length === 0) return [];
  try {
    const prompt = `You MUST classify these leads into the existing groups. Every lead MUST be assigned to a group, even if the fit isn't perfect.
Find creative ways to connect each lead's business to the existing groups' value propositions.

Company Context:
${companyContext}

Available Groups (you MUST use ONLY these groups):
${groups.map((g) => `${g.name}: ${g.description}`).join("\n")}

Leads to Classify (you MUST classify ALL of these):
${JSON.stringify(unassignedLeads, null, 2)}

Guidelines:
- EVERY lead MUST be assigned to one of the existing groups
- Think creatively about how each business could benefit from the services described in each group
- If a lead doesn't perfectly fit any group, assign it to the group where it could gain the most value
- Do NOT create new groups
- Do NOT leave any lead unassigned

Return a JSON array of objects with this structure:
[
  {
    "leadId": "string",
    "groupName": "string (must be one of the existing group names)"
  }
]

# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON ARRAY.`;
    const llmResponse = await generate(prompt);
    return parseUntilJson(llmResponse) as Array<{
      leadId: string;
      groupName: string;
    }>;
  } catch (e) {
    console.error("Error reclassifying unassigned leads:", e);
    return unassignedLeads.map((lead) => ({
      leadId: lead.id!,
      groupName: groups[0]?.name || "Unassigned",
    }));
  }
}

async function balanceGroups(
  groups: Group[],
  targetGroupCount: number,
  companyContext: string
): Promise<Group[]> {
  if (groups.length <= 1) return groups;
  let balancingInfo: {
    groups: Array<{
      name: string;
      description: string;
      sourceGroups: string[];
    }>;
  } | null = null;
  try {
    const prompt = `Analyze these groups and reorganize them into exactly ${targetGroupCount} balanced groups. Some groups may be too specific and can be merged into broader categories.

Company Context:
${companyContext}

Current Groups and their members:
${groups
  .map((g) => `${g.name} (${g.leadIds.length} leads): ${g.description}`)
  .join("\n")}

Guidelines:
- Create EXACTLY ${targetGroupCount} groups
- Ensure groups are balanced in size
- Create broader, more inclusive group categories
- Make sure descriptions are general enough to encompass multiple business types
- Focus on common business needs and value propositions

Return a JSON object with this structure:
{
  "groups": [
    {
      "name": "string",
      "description": "string",
      "sourceGroups": ["names of original groups to merge into this one"]
    }
  ]
}

# IMPORTANT: THERE SHOULD BE NO TEXT OR BACKTICKS OR ANYTHING ELSE BEFORE OR AFTER THE JSON OBJECT.`;
    const llmResponse = await generate(prompt);
    balancingInfo = parseUntilJson(llmResponse) as {
      groups: Array<{
        name: string;
        description: string;
        sourceGroups: string[];
      }>;
    };
  } catch (e) {
    console.error("Error balancing groups:", e);
    return groups;
  }
  if (!balancingInfo) return groups;
  const newGroups: Group[] = balancingInfo.groups.map((newGroup) => ({
    name: newGroup.name,
    description: newGroup.description,
    leadIds: newGroup.sourceGroups.flatMap(
      (sourceName) => groups.find((g) => g.name === sourceName)?.leadIds || []
    ),
  }));
  return newGroups;
}

export async function processLeadsPipeline({
  leads,
  companyContext,
  maxGroups = 10,
  predefinedGroups,
  onProgress,
  onLeadProcessed,
  onGroupCreated,
}: {
  leads: Lead[];
  companyContext: string;
  maxGroups?: number;
  predefinedGroups?: string[];
} & PipelineCallbacks): Promise<Lead[]> {
  try {
    console.log(
      `\n🚀 Starting pipeline processing for ${leads.length} leads...`
    );
    console.log(`📊 Target number of groups: ${maxGroups}`);
    if (predefinedGroups) {
      console.log(`👥 Using predefined groups: ${predefinedGroups.join(", ")}`);
    }
    const leadsWithIds = ensureUniqueIds(leads);
    const batches = batchArray(leadsWithIds, 50);
    console.log(
      `📦 Split leads into ${batches.length} batches of up to 50 leads each`
    );
    let groups: Group[] = [];
    let leadToGroup: Record<string, string> = {};
    if (predefinedGroups?.length) {
      console.log("\n🎯 Generating descriptions for predefined groups...");
      groups = await generateGroupDescriptions(
        predefinedGroups,
        companyContext
      );
      for (const group of groups) {
        try {
          await onGroupCreated?.({
            name: group.name,
            description: group.description,
          });
        } catch (e) {
          console.error("Error in onGroupCreated callback:", e);
        }
      }
      console.log("✅ Group descriptions generated");
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(
          `\n📝 Processing batch ${i + 1}/${batches.length} (${
            batch.length
          } leads)...`
        );
        try {
          await onProgress?.({
            phase: "classifying",
            batch: i + 1,
            totalBatches: batches.length,
            batchSize: batch.length,
          });
        } catch (e) {
          console.error("Error in onProgress callback:", e);
        }
        const assignments = await classifyLeadsIntoExistingGroups(
          batch,
          groups,
          companyContext
        );
        for (const { leadId, groupName } of assignments) {
          leadToGroup[leadId] = groupName;
          const group = groups.find((g) => g.name === groupName);
          if (group) {
            group.leadIds.push(leadId);
          }
        }
        console.log(`✅ Batch ${i + 1} classified`);
      }
    } else {
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(
          `\n📝 Processing batch ${i + 1}/${batches.length} (${
            batch.length
          } leads)...`
        );
        try {
          await onProgress?.({
            phase: "classifying",
            batch: i + 1,
            totalBatches: batches.length,
            batchSize: batch.length,
          });
        } catch (e) {
          console.error("Error in onProgress callback:", e);
        }
        let assignments: Array<{
          leadId: string;
          groupName: string;
          groupDescription?: string;
        }> = [];
        try {
          const prompt = `Analyze these leads and classify them into groups based on our company context.

Company Context:
${companyContext}

Guidelines:
- Create broader, more inclusive group categories that can encompass multiple business types
- Focus on common business needs and value propositions rather than specific industries
- Group descriptions must be general enough to apply to any company in the group
- The purpose of these groups is to help us craft tailored sales outreach messages
- Each group should represent a distinct angle or approach for providing value
- IMPORTANT: EVERY lead MUST be assigned to a group
- Try to distribute leads evenly among groups

Current Groups:
$${
            groups.length === 0
              ? "No groups created yet"
              : groups
                  .map(
                    (g) =>
                      `${g.name} (${g.leadIds.length} leads): ${g.description}`
                  )
                  .join("\n")
          }

Target Number of Groups: ${maxGroups}

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
          assignments = parseUntilJson(llmResponse) as Array<{
            leadId: string;
            groupName: string;
            groupDescription?: string;
          }>;
        } catch (e) {
          console.error("Failed to parse LLM response for batch", i + 1, e);
          assignments = batch.map((lead) => ({
            leadId: lead.id!,
            groupName: groups[0]?.name || "Unassigned",
          }));
        }
        for (const { leadId, groupName, groupDescription } of assignments) {
          leadToGroup[leadId] = groupName;
          let group = groups.find((g) => g.name === groupName);
          if (!group) {
            group = {
              name: groupName,
              description: groupDescription || "",
              leadIds: [leadId],
            };
            groups.push(group);
            try {
              await onGroupCreated?.({
                name: group.name,
                description: group.description,
              });
            } catch (e) {
              console.error("Error in onGroupCreated callback:", e);
            }
          } else {
            group.leadIds.push(leadId);
          }
        }
        console.log(
          `✅ Batch ${i + 1} classified into ${groups.length} groups`
        );
        if (
          groups.length !== maxGroups ||
          Math.max(...groups.map((g) => g.leadIds.length)) -
            Math.min(...groups.map((g) => g.leadIds.length)) >
            1
        ) {
          console.log(`\n🔄 Balancing groups into ${maxGroups} even groups...`);
          try {
            await onProgress?.({
              phase: "balancing",
              currentGroups: groups.length,
              targetGroups: maxGroups,
            });
          } catch (e) {
            console.error("Error in onProgress callback:", e);
          }
          groups = await balanceGroups(groups, maxGroups, companyContext);
          leadToGroup = {};
          for (const group of groups) {
            for (const leadId of group.leadIds) {
              leadToGroup[leadId] = group.name;
            }
            try {
              await onGroupCreated?.({
                name: group.name,
                description: group.description,
              });
            } catch (e) {
              console.error("Error in onGroupCreated callback:", e);
            }
          }
          console.log(
            `✅ Groups balanced: ${groups
              .map((g) => `${g.name} (${g.leadIds.length})`)
              .join(", ")}`
          );
        }
      }
    }
    const unassignedLeads = leadsWithIds.filter(
      (lead) => !leadToGroup[lead.id!]
    );
    if (unassignedLeads.length > 0) {
      console.log(
        `\n⚠️ Found ${unassignedLeads.length} unassigned leads, reclassifying...`
      );
      const assignments = await reclassifyUnassignedLeads(
        unassignedLeads,
        groups,
        companyContext
      );
      for (const { leadId, groupName } of assignments) {
        leadToGroup[leadId] = groupName;
        const group = groups.find((g) => g.name === groupName);
        if (group) {
          group.leadIds.push(leadId);
        }
      }
      console.log("✅ All leads assigned to groups");
    }
    console.log("\n📝 Generating pitches for each group...");
    const groupPitches: Record<string, string> = {};
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      console.log(
        `  ↳ Generating pitch for "${group.name}" (${i + 1}/${
          groups.length
        })...`
      );
      try {
        await onProgress?.({
          phase: "generating_pitch",
          group: group.name,
          current: i + 1,
          total: groups.length,
        });
      } catch (e) {
        console.error("Error in onProgress callback:", e);
      }
      let pitch = "";
      try {
        const pitchPrompt = `You are a world-class B2B sales copywriter. Please follow these instructions:
- Write a fully polished, highly personalized, and actionable sales pitch that is ready to use as-is.
- Do NOT include any placeholders, template language, or generic sections.
- Do NOT reference the group, recipient, or their company anywhere in the pitch.
- The pitch should NOT be in the form of an email, letter, or message—just a paragraphed, engaging, and insightful description of the value and services offered.
- Only talk about our company and its offerings, tailored to the needs and context of the group.
- Make every part specific, relevant, and complete.
- End with a strong, relevant call to action that encourages immediate engagement.
- IMPORTANT: Make sure the pitch is compelling and unique for this specific group.

Company Context: ${companyContext}
Group Name: ${group.name}
Group Description: ${group.description}
Number of Companies in Group: ${group.leadIds.length}`;
        pitch = await generate(pitchPrompt);
        if (!pitch.trim()) {
          pitch = await generate(pitchPrompt);
        }
      } catch (e) {
        console.error(`Error generating pitch for group ${group.name}:`, e);
        pitch = "";
      }
      groupPitches[group.name] = pitch.trim();
      const groupLeads = leadsWithIds.filter(
        (lead) => leadToGroup[lead.id!] === group.name
      );
      for (const lead of groupLeads) {
        const processedLead: ProcessedLead = {
          ...lead,
          id: lead.id!,
          groupName: group.name,
          pitch: groupPitches[group.name] || "",
        };
        try {
          await onLeadProcessed?.(processedLead);
        } catch (e) {
          console.error("Error in onLeadProcessed callback:", e);
        }
      }
    }
    console.log("✅ All pitches generated");
    console.log("\n🎁 Preparing final output...");
    const modifiedLeads = leadsWithIds.map((lead) => {
      const groupName = leadToGroup[lead.id!];
      return {
        ...lead,
        groupName,
        pitch: groupPitches[groupName] || "",
      };
    });
    console.log("\n✨ Pipeline processing complete!");
    console.log(
      `📊 Final statistics:\n- Total leads processed: ${
        leads.length
      }\n- Number of groups: ${groups.length}\n- Leads per group: ${groups
        .map((g) => `${g.name} (${g.leadIds.length})`)
        .join(", ")}\n`
    );
    return modifiedLeads;
  } catch (e) {
    console.error("Pipeline failed:", e);
    return leads.map((lead) => ({
      ...lead,
      groupName: "Unassigned",
      pitch: "",
    }));
  }
}
