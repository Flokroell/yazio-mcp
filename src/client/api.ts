import { YazioAuth } from "./auth.js";
import type {
  ConsumedItem,
  DailySummary,
  Exercise,
  Product,
  ProductSearchResult,
  User,
  UserGoals,
  UserWeight,
  WaterIntake,
} from "../types/api.js";

const BASE_URL = "https://yzapi.yazio.com/v15";

export class YazioClient {
  private auth: YazioAuth;

  constructor(email: string, password: string) {
    this.auth = new YazioAuth(email, password);
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = await this.auth.getAccessToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Yazio API error (${res.status} ${path}): ${body}`);
    }

    return res.json() as Promise<T>;
  }

  // --- User ---

  async getUser(): Promise<User> {
    return this.request<User>("/user");
  }

  // --- Daily Summary ---

  async getDailySummary(date: string): Promise<DailySummary> {
    return this.request<DailySummary>(`/user/widgets/daily-summary?date=${date}`);
  }

  // --- Consumed Items (Meals) ---

  async getConsumedItems(date: string): Promise<{ products: ConsumedItem[]; recipe_portions: unknown[]; simple_products: unknown[] }> {
    return this.request(`/user/consumed-items?date=${date}`);
  }

  async addConsumedItem(item: {
    id: string;
    product_id: string;
    date: string;
    daytime: string;
    amount: number;
    serving?: string;
    serving_quantity?: number;
  }): Promise<void> {
    await this.request("/user/consumed-items", {
      method: "POST",
      body: JSON.stringify({
        products: [item],
        recipe_portions: [],
        simple_products: [],
      }),
    });
  }

  async removeConsumedItem(itemId: string): Promise<void> {
    await this.request("/user/consumed-items", {
      method: "DELETE",
      body: JSON.stringify([itemId]),
    });
  }

  // --- Food Search ---

  async searchProducts(query: string, options?: { sex?: string; countries?: string[]; locales?: string[] }): Promise<ProductSearchResult[]> {
    const params = new URLSearchParams({ query });
    if (options?.sex) params.set("sex", options.sex);
    if (options?.countries) params.set("countries", options.countries.join(","));
    if (options?.locales) params.set("locales", options.locales.join(","));
    return this.request<ProductSearchResult[]>(`/products/search?${params}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // --- Goals ---

  async getGoals(date?: string): Promise<UserGoals> {
    const d = date || new Date().toISOString().split("T")[0];
    return this.request<UserGoals>(`/user/goals/unmodified?date=${d}`);
  }

  // --- Weight ---

  async getWeight(date?: string): Promise<UserWeight | null> {
    const d = date || new Date().toISOString().split("T")[0];
    return this.request<UserWeight | null>(`/user/bodyvalues/weight/last?date=${d}`);
  }

  // --- Water ---

  async getWaterIntake(date?: string): Promise<WaterIntake> {
    const d = date || new Date().toISOString().split("T")[0];
    return this.request<WaterIntake>(`/user/water-intake?date=${d}`);
  }

  async addWaterIntake(date: string, totalMl: number): Promise<void> {
    await this.request("/user/water-intake", {
      method: "POST",
      body: JSON.stringify({ date, water_intake: totalMl }),
    });
  }

  // --- Exercises ---

  async getExercises(date?: string): Promise<{ training: Exercise[]; custom_training: Exercise[] }> {
    const d = date || new Date().toISOString().split("T")[0];
    return this.request(`/user/exercises?date=${d}`);
  }
}
