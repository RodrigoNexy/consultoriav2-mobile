export interface ActivityLog {
  id: string;
  date: string;
  stepsActual: number | null;
  stepsTarget: number | null;
  cardioActualMinutes: number | null;
  cardioTargetMinutes: number | null;
  notes: string | null;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
}

export interface SaveActivityLogInput {
  date: string;
  stepsActual?: number | null;
  stepsTarget?: number | null;
  cardioActualMinutes?: number | null;
  cardioTargetMinutes?: number | null;
  notes?: string | null;
}

