import { ChangePasswordScreen } from '../../src/modules/change-password/components/ChangePasswordScreen';
import { useRouter } from 'expo-router';

export default function ChangePasswordPage() {
  const router = useRouter();

  return <ChangePasswordScreen onBack={() => router.back()} />;
}
