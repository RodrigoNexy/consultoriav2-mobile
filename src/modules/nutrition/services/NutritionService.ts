import { nutritionApi } from '../api/nutritionApi';
import { NutritionLog } from '../types';

export class NutritionService {
  async getAll(): Promise<NutritionLog[]> {
    const response = await nutritionApi.getAll();

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.logs || [];
  }
}

export const nutritionService = new NutritionService();

