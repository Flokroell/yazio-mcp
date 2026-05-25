import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWaterTool = {
  name: "get_water",
  description: "Get water intake for a date in milliliters.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const water = await client.getWaterIntake(date);
    return water;
  },
};
