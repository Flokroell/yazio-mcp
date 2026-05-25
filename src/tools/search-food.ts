import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const searchFoodTool = {
  name: "search_food",
  description: "Search the Yazio food database by name. Returns matching foods with calories, macros, serving sizes, and product IDs (needed for logging).",
  inputSchema: z.object({
    query: z.string().describe("Food name to search for (e.g. 'banana', 'chicken breast', 'Haferflocken')"),
    country: z.string().describe("Country code for regional results (e.g. 'DE', 'US')").optional(),
  }),
  handler: async (client: YazioClient, args: { query: string; country?: string }) => {
    const results = await client.searchProducts(args.query, {
      countries: args.country ? [args.country] : undefined,
    });
    return results;
  },
};
