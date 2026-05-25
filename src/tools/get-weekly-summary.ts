import { z } from "zod";
import type { YazioClient } from "../client/api.js";

export const getWeeklySummaryTool = {
  name: "get_weekly_summary",
  description: "Get a 7-day nutrition summary with daily totals and averages for calories, protein, carbs, fat, and water. Useful for tracking trends and consistency.",
  inputSchema: z.object({
    end_date: z.string().describe("Last day of the 7-day window (YYYY-MM-DD). Defaults to today.").optional(),
  }),
  handler: async (client: YazioClient, args: { end_date?: string }) => {
    const end = args.end_date ? new Date(args.end_date) : new Date();
    const days: Array<{ date: string; calories: number; protein_g: number; carbs_g: number; fat_g: number; water_ml: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const summary = await client.getDailySummary(dateStr);

      const calories = Math.round(
        (summary.meals.breakfast.nutrients["energy.energy"] +
          summary.meals.lunch.nutrients["energy.energy"] +
          summary.meals.dinner.nutrients["energy.energy"] +
          summary.meals.snack.nutrients["energy.energy"]) * 100
      );
      const protein = Math.round(
        (summary.meals.breakfast.nutrients["nutrient.protein"] +
          summary.meals.lunch.nutrients["nutrient.protein"] +
          summary.meals.dinner.nutrients["nutrient.protein"] +
          summary.meals.snack.nutrients["nutrient.protein"]) * 100
      );
      const carbs = Math.round(
        (summary.meals.breakfast.nutrients["nutrient.carb"] +
          summary.meals.lunch.nutrients["nutrient.carb"] +
          summary.meals.dinner.nutrients["nutrient.carb"] +
          summary.meals.snack.nutrients["nutrient.carb"]) * 100
      );
      const fat = Math.round(
        (summary.meals.breakfast.nutrients["nutrient.fat"] +
          summary.meals.lunch.nutrients["nutrient.fat"] +
          summary.meals.dinner.nutrients["nutrient.fat"] +
          summary.meals.snack.nutrients["nutrient.fat"]) * 100
      );

      days.push({ date: dateStr, calories, protein_g: protein, carbs_g: carbs, fat_g: fat, water_ml: summary.water_intake });
    }

    const daysWithData = days.filter((d) => d.calories > 0);
    const avg = daysWithData.length > 0
      ? {
          calories: Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length),
          protein_g: Math.round(daysWithData.reduce((s, d) => s + d.protein_g, 0) / daysWithData.length),
          carbs_g: Math.round(daysWithData.reduce((s, d) => s + d.carbs_g, 0) / daysWithData.length),
          fat_g: Math.round(daysWithData.reduce((s, d) => s + d.fat_g, 0) / daysWithData.length),
          water_ml: Math.round(daysWithData.reduce((s, d) => s + d.water_ml, 0) / daysWithData.length),
        }
      : null;

    return {
      period: { start: days[0].date, end: days[days.length - 1].date },
      days_tracked: daysWithData.length,
      daily: days,
      averages: avg,
    };
  },
};
