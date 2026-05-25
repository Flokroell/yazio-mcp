import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getGoalsTool = {
  name: "get_goals",
  description: "Get the user's nutrition and fitness goals: calorie target, macro targets (protein/carbs/fat in grams), step goal, weight goal, water goal.",
  inputSchema: z.object({}),
  handler: async (client: YazioClient) => {
    const goals = await client.getGoals();
    return goals;
  },
};
