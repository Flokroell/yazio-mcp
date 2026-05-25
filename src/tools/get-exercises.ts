import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getExercisesTool = {
  name: "get_exercises",
  description: "Get exercises logged for a date. Returns exercise names, duration, calories burned, and steps.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const exercises = await client.getExercises(args.date);
    return exercises;
  },
};
