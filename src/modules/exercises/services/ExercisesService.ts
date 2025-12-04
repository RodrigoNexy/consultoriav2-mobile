import { exercisesApi } from '../api/exercisesApi';
import { Exercise } from '../types';

export class ExercisesService {
  async getAll(query?: string): Promise<Exercise[]> {
    const response = await exercisesApi.getAll(query);

    if (response.error) {
      throw new Error(response.error.error);
    }

    return response.data?.exercises || [];
  }
}

export const exercisesService = new ExercisesService();

