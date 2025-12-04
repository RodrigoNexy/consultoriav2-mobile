export interface Exercise {
  id: string;
  name: string;
  folderName: string | null;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  category: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  youtubeUrl: string | null;
  images: Array<{
    index: number;
    url: string;
  }>;
}

export interface ExercisesResponse {
  exercises: Exercise[];
}

