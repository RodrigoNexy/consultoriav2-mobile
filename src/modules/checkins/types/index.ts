export interface CheckIn {
  id: string;
  date: string;
  weightKg: number | null;
  bodyFatPct: number | null;
  energyLevel: number | null;
  nutritionAdherence: number | null;
  trainingAdherence: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
  mood: string | null;
  notes: string | null;
  trainingSessionId: string | null;
  trainingSession: {
    id: string;
    workoutName: string;
    date: string;
  } | null;
  photos: Array<{
    id: string;
    url: string;
    thumbnailUrl: string;
  }>;
  createdAt: string;
}

export interface CreateCheckInInput {
  date?: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
  energyLevel?: number | null;
  nutritionAdherence?: number | null;
  trainingAdherence?: number | null;
  sleepQuality?: number | null;
  stressLevel?: number | null;
  mood?: string | null;
  notes?: string | null;
  trainingSessionId?: string | null;
  photoIds?: string[];
}

export interface CheckInsResponse {
  checkIns: CheckIn[];
}

