import { generate } from './generate';
import { PromptTemplate } from '@langchain/core/prompts';
import { parseUntilJson } from './parseUntilJson';
// import fs from 'fs';

const CONTEXT_LIMIT = 200_000;

const checkContextSize = (
  contextJson: Array<Record<string, any>> | string[]
) => {
  let clippedContext = [];
  let totalSize = 0;

  for (const item of contextJson) {
    if (!item) continue;

    const itemSize =
      typeof item === 'string' ? item.length : JSON.stringify(item).length;

    totalSize += itemSize;
    if (totalSize < CONTEXT_LIMIT) {
      clippedContext.push(item);
    } else {
      break;
    }
  }
  return clippedContext;
};

const cleanHtmlContent = (content: string): string => {
  content = content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  content = content.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ''
  );

  content = content.replace(/<[^>]+>/g, ' ');

  content = content.replace(/\s+/g, ' ').trim();

  return content;
};

const summarizeContext = async (
  context: string,
  query: string | null = null
) => {
  context = JSON.stringify(checkContextSize([context])[0]);
  const prompt = new PromptTemplate({
    template:
      `You are a helpful assistant that summarizes context.
        The context contains information from various sources.
        You need to extract the most relevant information and return it as a summary.
        The summary should be a distinct paragraph of relevant information.
        Include any relevant keywords, bullet points, or important phrases.
        The summary should be descriptive and comprehensive.
        Do not repeat information in the summary.
        Only include information that is directly relevant.
        Do not create new information, only summarize what is in the context.
        If the query is provided, the summary should be tailored to the query.
        ` +
      (query
        ? `
        The query is:
        \`\`\`
        {{query}}
        \`\`\`
        `
        : '') +
      `The context is:
        \`\`\`
        {{context}}
        \`\`\`
        `,
    inputVariables: ['context', 'query'],
    templateFormat: 'mustache',
  });

  const formattedPrompt = await prompt.format({ context, query });
  const response = await generate(formattedPrompt);

  // fs.appendFileSync('cleanedContext.txt', "==========At Summarize Context==========\n\n");
  // fs.appendFileSync('cleanedContext.txt', formattedPrompt);
  // fs.appendFileSync('cleanedContext.txt', response.content.toString());
  // fs.appendFileSync('cleanedContext.txt', "==========End of Summarize Context==========\n\n");
  return response;
};

export const summarizeContextJSON = async (
  contextJson: Array<Record<string, any>> | string[],
  query: string | null = null
): Promise<string[]> => {
  if (!contextJson || contextJson.length === 0) {
    return [];
  }

  if (!Array.isArray(contextJson)) {
    contextJson = [contextJson];
  }

  const cleanedContextPromises = contextJson
    .map(async (item) => {
      if (typeof item === 'string') {
        const cleanedItem = cleanHtmlContent(item);
        const summary = await summarizeContext(cleanedItem, query);
        return summary;
      } else if (item.content?.data) {
        const cleanedItem = cleanHtmlContent(item.content.data);
        const summary = await summarizeContext(cleanedItem, query);
        return summary;
      }
      return JSON.stringify(item);
    })
    .filter(Boolean);

  if (cleanedContextPromises.length === 0) return [];

  const cleanedContext = await Promise.all(cleanedContextPromises);

  // fs.appendFileSync('cleanedContext.txt', "==========At Summarize Context JSON==========\n\n");
  // fs.appendFileSync('cleanedContext.txt', cleanedContext.join('\n\n'));
  // fs.appendFileSync('cleanedContext.txt', "==========End of Summarize Context JSON==========\n\n");

  const template = query
    ? `You are a helpful assistant that summarizes context.
        The context contains information from various sources.
        You are given a query and you need to extract the most relevant information from the context about the query and return it as a list of summaries.
        The summaries should be descriptive, comprehensive, and contain any relevant keywords, bullet points, or important phrases.
        Each summary should be a distinct paragraph of relevant information.
        Do not repeat information across summaries.
        Only include information that is directly relevant to the query.
        Do not create new information, only summarize what is in the context.

        Your response should be a JSON object in the following format:
        {
            "summary": [
                "<relevant information from the context>",
                ...
            ]
        }

        The context is:
        {{context}}

        The query is:
        {{query}}`
    : `You are a helpful assistant that summarizes context.
        The context contains information from various sources.
        You need to extract the most relevant information and return it as a list of summaries.
        Each summary should be a distinct paragraph of relevant information.
        Include any relevant keywords, bullet points, or important phrases.
        The summaries should be descriptive and comprehensive.
        Do not repeat information across summaries.
        Only include information that is directly relevant.
        Do not create new information, only summarize what is in the context.

        Your response should be a JSON object in the following format:
        {
            "summary": [
                "<relevant information from the context>",
                ...
            ]
        }

        The context is:
        {{context}}`;

  const inputVariables = query ? ['context', 'query'] : ['context'];
  const prompt = new PromptTemplate({
    template,
    inputVariables,
    templateFormat: 'mustache',
  });

  try {
    const response = await generate(await prompt.format({
      context: cleanedContext.join('\n\n'),
      ...(query && { query: query }),
    }));

    const jsonContent = parseUntilJson(response);
    return jsonContent?.summary || [];
  } catch (error) {
    console.error('Error in summarization:', error);
    return [];
  }
};