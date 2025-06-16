import { ChatOpenAI } from "@langchain/openai";

const BASE_URL_WITH_PROXY = `${
  process.env.ALCHEMYST_API_URL || 'https://platform-backend.getalchemystai.com/api/v1'
}/proxy/${process.env.ALCHEMYST_BASE_URL || 'http://34.47.176.206/v1'}/${
  process.env.OPENAI_API_KEY || 'sk-20fc903b9a8674654daf5054baa5f7e92080f5e4594540b3'
}`;

console.log(BASE_URL_WITH_PROXY);

const lcClientWithProxy = new ChatOpenAI({
  apiKey: process.env.ALCHEMYST_API_KEY || 'sk-U468I-UASQC-MD9MI-03WWQ',
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
