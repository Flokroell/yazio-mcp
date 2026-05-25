import { z } from "zod";
import type { YazioClient } from "../client/api.js";
import type { ConsumedItem } from "../types/api.js";

export const getMealsTool = {
  name: "get_meals",
  description: "Get all food entries for a date, grouped by meal (breakfast, lunch, dinner, snacks). Returns item names, amounts, and calories per item.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const items = await client.getConsumedItems(date);

    const grouped: Record<string, Array<{ id: string; product_id: string; amount_g: number; serving: string; serving_quantity: number }>> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    for (const item of (items.products || []) as ConsumedItem[]) {
      const entry = {
        id: item.id,
        product_id: item.product_id,
        amount_g: item.amount,
        serving: item.serving,
        serving_quantity: item.serving_quantity,
      };
      if (grouped[item.daytime]) {
        grouped[item.daytime].push(entry);
      }
    }

    const totalItems = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

    return {
      date,
      total_items: totalItems,
      meals: grouped,
    };
  },
};
