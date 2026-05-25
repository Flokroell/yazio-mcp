#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { YazioClient } from "./client/api.js";
import {
  getDailySummaryTool,
  getMealsTool,
  searchFoodTool,
  logFoodTool,
  removeFoodTool,
  getGoalsTool,
  getWeightTool,
  logWeightTool,
  getWaterTool,
  logWaterTool,
  getWeeklySummaryTool,
  getExercisesTool,
} from "./tools/index.js";

const email = process.env.YAZIO_EMAIL;
const password = process.env.YAZIO_PASSWORD;

if (!email || !password) {
  console.error("Missing YAZIO_EMAIL or YAZIO_PASSWORD environment variables");
  process.exit(1);
}

const client = new YazioClient(email, password);

const server = new McpServer({
  name: "yazio-mcp",
  version: "0.1.0",
});

const tools = [
  getDailySummaryTool,
  getMealsTool,
  searchFoodTool,
  logFoodTool,
  removeFoodTool,
  getGoalsTool,
  getWeightTool,
  logWeightTool,
  getWaterTool,
  logWaterTool,
  getWeeklySummaryTool,
  getExercisesTool,
];

for (const tool of tools) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema.shape,
    async (args: Record<string, unknown>) => {
      try {
        const result = await tool.handler(client, args as never);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
