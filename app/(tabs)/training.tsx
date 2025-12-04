import { TrainingScreen } from '../../src/modules/training/components/TrainingScreen';
import { useRouter } from 'expo-router';

export default function TrainingPage() {
  const router = useRouter();

  return <TrainingScreen onBack={() => router.back()} />;
}
