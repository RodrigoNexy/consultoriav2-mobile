import { SupplementsScreen } from '../../src/modules/supplements/components/SupplementsScreen';
import { useRouter } from 'expo-router';

export default function SupplementsPage() {
  const router = useRouter();

  return <SupplementsScreen onBack={() => router.back()} />;
}
