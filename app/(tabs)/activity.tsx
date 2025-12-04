import { ActivityScreen } from '../../src/modules/activity/components/ActivityScreen';
import { useRouter } from 'expo-router';

export default function ActivityPage() {
  const router = useRouter();

  return <ActivityScreen onBack={() => router.back()} />;
}
