import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const logWaterTool = {
  name: "log_water",
  description: "Add water intake in milliliters. Reads current total and adds your amount on top (no need to calculate cumulative total yourself).",
  inputSchema: z.object({
    amount_ml: z.number().describe("Amount of water to add in milliliters (e.g. 250 for a glass, 500 for a bottle)"),
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { amount_ml: number; date?: string }) => {
    if (args.amount_ml <= 0 || args.amount_ml > 5000) {
      throw new Error("Water amount must be between 1 and 5000 ml");
    }
    const date = args.date || new Date().toISOString().split("T")[0];
    const current = await client.getWaterIntake(date);
    const newTotal = (current.water_intake || 0) + args.amount_ml;
    const datetime = `${date} ${new Date().toTimeString().split(" ")[0]}`;
    await client.addWaterIntake(datetime, newTotal);
    return {
      success: true,
      added_ml: args.amount_ml,
      previous_total_ml: current.water_intake || 0,
      new_total_ml: newTotal,
    };
  },
};
