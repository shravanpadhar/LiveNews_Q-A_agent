import { config } from "dotenv";
config(); // This loads your hidden keys from the .env file

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { createReactAgent } from "@langchain/langgraph/prebuilt"; // Fixed import path

// 1. Initialize our Gemini LLM model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 2. Define the tools the Agent can use (Google Search)
const searchTool = new SerpAPI(process.env.SERPAPI_API_KEY, {
  location: "India",
});
const tools = [searchTool];

// 3. Create the prebuilt React Agent
const agent = createReactAgent({
  llm: model,
  tools: tools,
  messageModifier: "You are a helpful News and Q&A Assistant. Use the search tool to find the absolute latest information before answering any news queries.",
});

// 4. Run the Agent
async function runAgent() {
  console.log("🤖 Agent is thinking and searching...");

  const response = await agent.invoke({
    messages: [{ role: "user", content: "What is the latest news about AI?" }],
  });

  // Extract the text content from the final message in the array
  const finalAnswer = response.messages[response.messages.length - 1].content;

  console.log("\n🧠 Final Output:\n", finalAnswer);
}

runAgent();