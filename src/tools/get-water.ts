import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWaterTool = {
  name: "get_water",
  description: "Get water intake for a date in milliliters, with goal progress.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const [water, goals] = await Promise.all([
      client.getWaterIntake(date),
      client.getGoals(date),
    ]);
    return {
      date,
      intake_ml: water.water_intake,
      goal_ml: goals.water,
      remaining_ml: Math.max(0, goals.water - water.water_intake),
      progress_percent: Math.round((water.water_intake / goals.water) * 100),
    };
  },
};
