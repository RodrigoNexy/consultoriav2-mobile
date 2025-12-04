import { trainingApi } from '../api/trainingApi';
import { TrainingSession } from '../types';

export class TrainingService {
  async getAll(startDate?: string, endDate?: string): Promise<TrainingSession[]> {
    const response = await trainingApi.getAll(startDate, endDate);

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.sessions || [];
  }
}

export const trainingService = new TrainingService();

