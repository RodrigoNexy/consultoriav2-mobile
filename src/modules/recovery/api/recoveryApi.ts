import { apiClient } from '../../../shared/api/client';
import { RecoveryLog, RecoveryLogsResponse, SaveRecoveryLogInput } from '../types';

export const recoveryApi = {
  getAll: async () => {
    return apiClient.get<RecoveryLogsResponse>('/recovery');
  },
  create: async (data: SaveRecoveryLogInput) => {
    return apiClient.post<RecoveryLog>('/recovery', data);
  },
  delete: async (logId: string) => {
    return apiClient.delete(`/recovery/${logId}`);
  },
};

