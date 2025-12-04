import { apiClient } from '../../../shared/api/client';
import { SupplementPlansResponse } from '../types';

export const supplementsApi = {
  getAll: async () => {
    return apiClient.get<SupplementPlansResponse>('/supplements');
  },
};

