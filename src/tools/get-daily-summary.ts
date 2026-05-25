import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getDailySummaryTool = {
  name: "get_daily_summary",
  description: "Get daily nutrition summary: calories eaten/remaining/burned, macros (protein/carbs/fat), water intake, steps. Returns goal progress for the day.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const summary = await client.getDailySummary(date);
    return summary;
  },
};
