import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWeightTool = {
  name: "get_weight",
  description: "Get the most recent weight entry. Returns weight in kg and the date it was logged.",
  inputSchema: z.object({
    date: z.string().describe("Reference date in YYYY-MM-DD format. Returns the last weight entry on or before this date.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const weight = await client.getWeight(args.date);
    return weight;
  },
};
