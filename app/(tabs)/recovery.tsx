import { RecoveryScreen } from '../../src/modules/recovery/components/RecoveryScreen';
import { useRouter } from 'expo-router';

export default function RecoveryPage() {
  const router = useRouter();

  return <RecoveryScreen onBack={() => router.back()} />;
}
