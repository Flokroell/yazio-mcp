export interface Token {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

export type Daytime = "breakfast" | "lunch" | "dinner" | "snack";

export interface Nutrients {
  "energy.energy": number;
  "nutrient.carb": number;
  "nutrient.protein": number;
  "nutrient.fat": number;
  "nutrient.fiber"?: number;
  "nutrient.sugar"?: number;
  "nutrient.saturated_fat"?: number;
  "mineral.sodium"?: number;
  "mineral.potassium"?: number;
  "mineral.calcium"?: number;
  "mineral.iron"?: number;
  "vitamin.a"?: number;
  "vitamin.c"?: number;
  "vitamin.d"?: number;
  "vitamin.b6"?: number;
  "vitamin.b12"?: number;
  "nutrient.cholesterol"?: number;
  "nutrient.monounsaturated_fat"?: number;
  "nutrient.polyunsaturated_fat"?: number;
  "nutrient.trans_fat"?: number;
  [key: string]: number | undefined;
}

export interface Serving {
  serving: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  is_verified: boolean;
  is_private: boolean;
  is_deleted: boolean;
  has_ean: boolean;
  category: string;
  producer: string;
  nutrients: Nutrients;
  updated_at: string;
  servings: Serving[];
  base_unit: string;
  eans: string[];
  language: string;
  countries: string[];
}

export interface ProductSearchResult {
  score: number;
  name: string;
  product_id: string;
  serving: string;
  serving_quantity: number;
  amount: number;
  base_unit: string;
  producer: string;
  is_verified: boolean;
  nutrients: Pick<Nutrients, "energy.energy" | "nutrient.carb" | "nutrient.protein" | "nutrient.fat">;
  countries: string[];
  language: string;
}

export interface ConsumedItem {
  id: string;
  date: string;
  daytime: Daytime;
  type: string;
  product_id: string;
  amount: number;
  serving: string;
  serving_quantity: number;
}

export interface UserWeight {
  id: string;
  date: string;
  value: number;
  external_id: string | null;
  gateway: string;
  source: string;
}

export interface UserGoals {
  "energy.energy": number;
  "nutrient.protein": number;
  "nutrient.fat": number;
  "nutrient.carb": number;
  "activity.step": number;
  "bodyvalue.weight": number;
  water: number;
}

export interface WaterIntake {
  water_intake: number;
  gateway: string;
  source: string;
}

export interface MealSummary {
  nutrients: Nutrients;
  energy_goal: number;
}

export interface DailySummary {
  activity_energy: number;
  consume_activity_energy: boolean;
  steps: number;
  water_intake: number;
  goals: UserGoals;
  units: Record<string, string>;
  meals: {
    breakfast: MealSummary;
    lunch: MealSummary;
    dinner: MealSummary;
    snack: MealSummary;
  };
  active_fasting_countdown_template_key: string | null;
}

export interface User {
  email: string;
  premium_type: string;
  sex: string;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  body_height: number;
  goal: string;
  date_of_birth: string;
  registration_date: string;
  uuid: string;
  activity_degree: string;
  [key: string]: unknown;
}

export interface Exercise {
  id: string;
  note: string;
  date: string;
  name: string;
  external_id: string | null;
  energy: number;
  distance: number;
  duration: number;
  source: string;
  gateway: string;
  steps: number;
}
