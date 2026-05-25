import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const logWeightTool = {
  name: "log_weight",
  description: "Log a weight entry in kg. Adds a new weight measurement for the given date.",
  inputSchema: z.object({
    weight_kg: z.number().describe("Weight in kilograms (e.g. 75.5)"),
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { weight_kg: number; date?: string }) => {
    if (args.weight_kg < 20 || args.weight_kg > 300) {
      throw new Error("Weight must be between 20 and 300 kg");
    }
    const date = args.date || new Date().toISOString().split("T")[0];
    await client.logWeight(args.weight_kg, date);
    return { success: true, logged: { kg: args.weight_kg, date } };
  },
};
