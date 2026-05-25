import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getExercisesTool = {
  name: "get_exercises",
  description: "Get exercises logged for a date. Returns exercise names, duration in minutes, calories burned, distance, and steps.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const exercises = await client.getExercises(date);

    const all = [...(exercises.training || []), ...(exercises.custom_training || [])];
    return {
      date,
      count: all.length,
      total_calories_burned: all.reduce((s, e) => s + e.energy, 0),
      total_duration_min: all.reduce((s, e) => s + e.duration, 0),
      exercises: all.map((e) => ({
        name: e.name,
        calories_burned: e.energy,
        duration_min: e.duration,
        distance_km: e.distance > 0 ? e.distance : undefined,
        steps: e.steps > 0 ? e.steps : undefined,
      })),
    };
  },
};
