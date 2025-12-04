import { apiClient } from '../../../shared/api/client';
import { TrainingSessionsResponse } from '../types';

export const trainingApi = {
  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    return apiClient.get<TrainingSessionsResponse>(`/training${queryString ? `?${queryString}` : ''}`);
  },
};

