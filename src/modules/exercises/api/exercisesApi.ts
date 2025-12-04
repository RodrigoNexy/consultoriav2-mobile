import { apiClient } from '../../../shared/api/client';
import { ExercisesResponse } from '../types';

export const exercisesApi = {
  getAll: async (query?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    const queryString = params.toString();
    return apiClient.get<ExercisesResponse>(`/exercises${queryString ? `?${queryString}` : ''}`);
  },
};

