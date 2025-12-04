export interface RecoveryLog {
  id: string;
  date: string;
  sleepHours: number | null;
  sleepQuality: number | null;
  muscleSoreness: number | null;
  energyLevel: number | null;
  notes: string | null;
}

export interface RecoveryLogsResponse {
  logs: RecoveryLog[];
}

export interface SaveRecoveryLogInput {
  date: string;
  sleepHours?: number | null;
  sleepQuality?: number | null;
  muscleSoreness?: number | null;
  energyLevel?: number | null;
  notes?: string | null;
}

