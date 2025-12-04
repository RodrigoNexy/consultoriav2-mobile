import { apiClient } from '../../../shared/api/client';
import { ActivityLog, ActivityLogsResponse, SaveActivityLogInput } from '../types';

export const activityApi = {
  getAll: async () => {
    return apiClient.get<ActivityLogsResponse>('/activity');
  },
  create: async (data: SaveActivityLogInput) => {
    return apiClient.post<ActivityLog>('/activity', data);
  },
  delete: async (logId: string) => {
    return apiClient.delete(`/activity/${logId}`);
  },
};

