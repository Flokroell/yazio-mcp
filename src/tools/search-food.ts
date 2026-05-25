import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const searchFoodTool = {
  name: "search_food",
  description: "Search the Yazio food database by name. Returns matching foods with calories, macros, serving sizes, and product IDs (needed for log_food). Nutrients are per 100g.",
  inputSchema: z.object({
    query: z.string().describe("Food name to search for (e.g. 'banana', 'chicken breast', 'Haferflocken')"),
    country: z.string().describe("Country code for regional results (e.g. 'DE', 'US'). Defaults to DE.").optional(),
  }),
  handler: async (client: YazioClient, args: { query: string; country?: string }) => {
    const results = await client.searchProducts(args.query, {
      countries: [args.country || "DE"],
    });

    return {
      query: args.query,
      result_count: results.length,
      results: results.slice(0, 15).map((r) => ({
        product_id: r.product_id,
        name: r.name,
        producer: r.producer || undefined,
        verified: r.is_verified,
        per_100g: {
          calories_kcal: Math.round(r.nutrients["energy.energy"] * 100),
          protein_g: Math.round(r.nutrients["nutrient.protein"] * 100),
          carbs_g: Math.round(r.nutrients["nutrient.carb"] * 100),
          fat_g: Math.round(r.nutrients["nutrient.fat"] * 100),
        },
        default_serving: {
          name: r.serving,
          amount_g: r.amount,
          quantity: r.serving_quantity,
        },
      })),
    };
  },
};
