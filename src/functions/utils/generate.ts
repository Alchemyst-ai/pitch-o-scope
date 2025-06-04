import { ChatOpenAI } from "@langchain/openai";

const BASE_URL_WITH_PROXY = `${
  process.env.ALCHEMYST_API_URL
}/proxy/${process.env.ALCHEMYST_BASE_URL}/${
  process.env.OPENAI_API_KEY
}`;

console.log(BASE_URL_WITH_PROXY);

const lcClientWithProxy = new ChatOpenAI({
  apiKey: process.env.ALCHEMYST_API_KEY,
  model: "alchemyst-ai/alchemyst-c1",
  configuration: {
    baseURL: BASE_URL_WITH_PROXY,
  },
});


export const generate = async (prompt: string) => {
  const messages: Parameters<typeof lcClientWithProxy.invoke>[0] = [{
    role: "user",
    content: prompt,
  }]
  const response = await lcClientWithProxy.invoke(messages);
  return response.content.toString();
};

// Example usage
// const response = await generate("Hello, how are you?");
// console.log(response);
