import OpenAI from "openai";

export const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Bun.env.OPENROUTER_API_KEY,
});
