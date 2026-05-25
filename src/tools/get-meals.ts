import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getMealsTool = {
  name: "get_meals",
  description: "Get all food entries for a date, grouped by meal (breakfast, lunch, dinner, snacks). Returns item names, amounts, and calories per item.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const items = await client.getConsumedItems(date);
    return items;
  },
};
