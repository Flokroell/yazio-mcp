import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getDailySummaryTool = {
  name: "get_daily_summary",
  description: "Get daily nutrition summary: calories eaten/remaining/burned, macros (protein/carbs/fat), water intake, steps. Returns goal progress for the day.",
  inputSchema: z.object({
    date: z.string().describe("Date in YYYY-MM-DD format. Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { date?: string }) => {
    const date = args.date || new Date().toISOString().split("T")[0];
    const summary = await client.getDailySummary(date);

    const totalEaten = Math.round(
      (summary.meals.breakfast.nutrients["energy.energy"] +
        summary.meals.lunch.nutrients["energy.energy"] +
        summary.meals.dinner.nutrients["energy.energy"] +
        summary.meals.snack.nutrients["energy.energy"]) * 100
    );
    const calorieGoal = summary.goals["energy.energy"];
    const remaining = calorieGoal - totalEaten + summary.activity_energy;

    const totalProtein = Math.round(
      (summary.meals.breakfast.nutrients["nutrient.protein"] +
        summary.meals.lunch.nutrients["nutrient.protein"] +
        summary.meals.dinner.nutrients["nutrient.protein"] +
        summary.meals.snack.nutrients["nutrient.protein"]) * 100
    );
    const totalCarbs = Math.round(
      (summary.meals.breakfast.nutrients["nutrient.carb"] +
        summary.meals.lunch.nutrients["nutrient.carb"] +
        summary.meals.dinner.nutrients["nutrient.carb"] +
        summary.meals.snack.nutrients["nutrient.carb"]) * 100
    );
    const totalFat = Math.round(
      (summary.meals.breakfast.nutrients["nutrient.fat"] +
        summary.meals.lunch.nutrients["nutrient.fat"] +
        summary.meals.dinner.nutrients["nutrient.fat"] +
        summary.meals.snack.nutrients["nutrient.fat"]) * 100
    );

    return {
      date,
      calories: {
        eaten: totalEaten,
        goal: calorieGoal,
        remaining,
        burned_from_activity: summary.activity_energy,
      },
      macros: {
        protein: { eaten_g: totalProtein, goal_g: Math.round(summary.goals["nutrient.protein"]) },
        carbs: { eaten_g: totalCarbs, goal_g: Math.round(summary.goals["nutrient.carb"]) },
        fat: { eaten_g: totalFat, goal_g: Math.round(summary.goals["nutrient.fat"]) },
      },
      water: { intake_ml: summary.water_intake, goal_ml: summary.goals.water },
      steps: { count: summary.steps, goal: summary.goals["activity.step"] },
      meals_breakdown: {
        breakfast: { kcal: Math.round(summary.meals.breakfast.nutrients["energy.energy"] * 100), goal_kcal: summary.meals.breakfast.energy_goal },
        lunch: { kcal: Math.round(summary.meals.lunch.nutrients["energy.energy"] * 100), goal_kcal: summary.meals.lunch.energy_goal },
        dinner: { kcal: Math.round(summary.meals.dinner.nutrients["energy.energy"] * 100), goal_kcal: summary.meals.dinner.energy_goal },
        snack: { kcal: Math.round(summary.meals.snack.nutrients["energy.energy"] * 100), goal_kcal: summary.meals.snack.energy_goal },
      },
    };
  },
};
