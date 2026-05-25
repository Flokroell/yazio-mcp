import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWeeklySummaryTool = {
  name: "get_weekly_summary",
  description: "Get a 7-day nutrition summary with daily averages for calories, protein, carbs, fat, and water. Useful for trend analysis.",
  inputSchema: z.object({
    end_date: z.string().describe("Last day of the 7-day window (YYYY-MM-DD). Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { end_date?: string }) => {
    const end = args.end_date ? new Date(args.end_date) : new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const summary = await client.getDailySummary(dateStr);
      days.push({ date: dateStr, summary });
    }

    return { days, period: { start: days[0].date, end: days[days.length - 1].date } };
  },
};
