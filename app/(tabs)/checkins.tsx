import { CheckInsScreen } from '../../src/modules/checkins/components/CheckInsScreen';
import { useRouter } from 'expo-router';

export default function CheckInsPage() {
  const router = useRouter();

  return <CheckInsScreen onBack={() => router.back()} />;
}
