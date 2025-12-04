import { activityApi } from '../api/activityApi';
import { ActivityLog, SaveActivityLogInput } from '../types';

export class ActivityService {
  async getAll(): Promise<ActivityLog[]> {
    const response = await activityApi.getAll();

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.logs || [];
  }

  async create(data: SaveActivityLogInput): Promise<ActivityLog> {
    const response = await activityApi.create(data);

    if (response.error) {
      throw new Error(response.error.error);
    }

    if (!response.data) {
      throw new Error('Erro ao criar registro de atividade');
    }

    return response.data;
  }

  async delete(logId: string): Promise<void> {
    const response = await activityApi.delete(logId);

    if (response.error) {
      throw new Error(response.error.error);
    }
  }
}

export const activityService = new ActivityService();

