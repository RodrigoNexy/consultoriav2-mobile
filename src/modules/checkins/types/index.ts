export interface CheckInPhoto {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  capturedAt: string | null;
}

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
  mood: number | null;
  notes: string | null;
  trainingSessionId: string | null;
  trainingSession: {
    id: string;
    workoutName: string;
    date: string;
  } | null;
  photos: CheckInPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckInInput {
  date: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
  energyLevel?: number | null;
  nutritionAdherence?: number | null;
  trainingAdherence?: number | null;
  sleepQuality?: number | null;
  stressLevel?: number | null;
  mood?: number | null;
  notes?: string | null;
  trainingSessionId?: string | null;
  stepsActual?: number | null;
  cardioActualMinutes?: number | null;
  photoIds?: string[];
}

export interface CheckInsResponse {
  checkIns: CheckIn[];
}

