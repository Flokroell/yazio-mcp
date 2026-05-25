import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWeightTool = {
  name: "get_weight",
  description: "Get weight data. Without date range, returns the most recent entry. With start/end dates, returns weight history for trend analysis.",
  inputSchema: z.object({
    start_date: z.string().describe("Start date for history range (YYYY-MM-DD). If omitted, returns only the latest entry.").optional(),
    end_date: z.string().describe("End date for history range (YYYY-MM-DD). Defaults to today if start_date is set.").optional(),
  }),
  handler: async (client: YazioClient, args: { start_date?: string; end_date?: string }) => {
    if (args.start_date) {
      const end = args.end_date || new Date().toISOString().split("T")[0];
      const history = await client.getWeightHistory(args.start_date, end);
      return {
        type: "history",
        period: { start: args.start_date, end },
        entries: history.map((e) => ({ date: e.date.split(" ")[0], kg: e.value })),
        count: history.length,
      };
    }

    const weight = await client.getWeight();
    if (!weight) return { type: "latest", entry: null, message: "No weight entries found." };
    return {
      type: "latest",
      entry: { date: weight.date.split(" ")[0], kg: weight.value },
    };
  },
};
