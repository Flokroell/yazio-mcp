import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const removeFoodTool = {
  name: "remove_food",
  description: "Remove a food entry from the diary. Use get_meals first to find the item ID.",
  inputSchema: z.object({
    item_id: z.string().describe("The consumed item UUID to remove (from get_meals results)"),
  }),
  handler: async (client: YazioClient, args: { item_id: string }) => {
    await client.removeConsumedItem(args.item_id);
    return { success: true, removed: args.item_id };
  },
};
