import { apiClient } from '../../../shared/api/client';
import { NutritionLogsResponse } from '../types';

export const nutritionApi = {
  getAll: async () => {
    return apiClient.get<NutritionLogsResponse>('/nutrition');
  },
};

