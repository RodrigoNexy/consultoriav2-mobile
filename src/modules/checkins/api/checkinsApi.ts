import { apiClient } from '../../../shared/api/client';
import { CheckInsResponse, CheckIn, CreateCheckInInput } from '../types';

export const checkinsApi = {
  getAll: async (limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const query = params.toString();
    return apiClient.get<CheckInsResponse>(`/checkins${query ? `?${query}` : ''}`);
  },

  create: async (input: CreateCheckInInput) => {
    return apiClient.post<CheckIn>('/checkins', input);
  },
};

