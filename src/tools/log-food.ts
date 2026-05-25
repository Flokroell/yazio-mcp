import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const logFoodTool = {
  name: "log_food",
  description: "Add a food item to the diary. Requires a product_id from search_food. Specify meal type and amount in grams (or use serving name + quantity).",
  inputSchema: z.object({
    product_id: z.string().describe("Product UUID from search_food results"),
    meal: z.enum(["breakfast", "lunch", "dinner", "snack"]).describe("Which meal to log this under"),
    amount_g: z.number().describe("Amount in grams"),
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
    serving: z.string().describe("Serving name (e.g. 'piece', 'cup', 'portion'). Optional.").optional(),
    serving_quantity: z.number().describe("Number of servings. Optional.").optional(),
  }),
  handler: async (client: YazioClient, args: {
    product_id: string;
    meal: string;
    amount_g: number;
    date?: string;
    serving?: string;
    serving_quantity?: number;
  }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const id = crypto.randomUUID();
    await client.addConsumedItem({
      id,
      product_id: args.product_id,
      date,
      daytime: args.meal,
      amount: args.amount_g,
      serving: args.serving,
      serving_quantity: args.serving_quantity,
    });
    return {
      success: true,
      logged: { id, product_id: args.product_id, meal: args.meal, amount_g: args.amount_g, date },
    };
  },
};
