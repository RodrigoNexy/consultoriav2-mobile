export interface TrainingSet {
  id: string;
  setIndex: number;
  weightKg: number | null;
  reps: number | null;
  volume: number | null;
}

export interface TrainingExercise {
  id: string;
  name: string;
  notes: string | null;
  youtubeUrl: string | null;
  folderName: string | null;
  order: number;
  sets: TrainingSet[];
}

export interface TrainingSession {
  id: string;
  date: string;
  workoutName: string;
  durationMinutes: number | null;
  performanceScore: number | null;
  totalVolume: number | null;
  notes: string | null;
  exercises: TrainingExercise[];
  createdAt: string;
}

export interface TrainingSessionsResponse {
  sessions: TrainingSession[];
}

