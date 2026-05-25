import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const logWeightTool = {
  name: "log_weight",
  description: "Log a weight entry in kg. This adds a new weight measurement for the given date.",
  inputSchema: z.object({
    weight_kg: z.number().describe("Weight in kilograms (e.g. 75.5)"),
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (_client: YazioClient, args: { weight_kg: number; date?: string }) => {
    // TODO: Implement once we confirm the POST /user/bodyvalues/weight endpoint
    // The existing libraries don't expose this -- needs API exploration
    void args;
    return { error: "Not yet implemented -- weight POST endpoint needs confirmation" };
  },
};
