import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const logWaterTool = {
  name: "log_water",
  description: "Add water intake in milliliters. Automatically reads current intake and adds the specified amount (you don't need to calculate the cumulative total).",
  inputSchema: z.object({
    amount_ml: z.number().describe("Amount of water to add in milliliters (e.g. 250 for a glass)"),
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { amount_ml: number; date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const current = await client.getWaterIntake(date);
    const newTotal = (current.water_intake || 0) + args.amount_ml;
    const dateTime = `${date} ${new Date().toTimeString().split(" ")[0]}`;
    await client.addWaterIntake(dateTime, newTotal);
    return { success: true, added_ml: args.amount_ml, total_ml: newTotal };
  },
};
