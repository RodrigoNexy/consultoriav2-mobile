export interface NutritionMealItem {
  id: string;
  foodName: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
}

export interface NutritionMeal {
  id: string;
  name: string;
  scheduledAt: string | null;
  notes: string | null;
  order: number;
  items: NutritionMealItem[];
}

export interface NutritionLog {
  id: string;
  periodStart: string;
  periodEnd: string;
  periodicity: string;
  caloriesTarget: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  notes: string | null;
  meals: NutritionMeal[];
}

export interface NutritionLogsResponse {
  logs: NutritionLog[];
}

