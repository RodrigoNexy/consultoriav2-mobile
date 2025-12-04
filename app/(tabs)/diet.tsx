import { DietScreen } from '../../src/modules/nutrition/components/DietScreen';
import { useRouter } from 'expo-router';

export default function DietPage() {
  const router = useRouter();

  return <DietScreen onBack={() => router.back()} />;
}
