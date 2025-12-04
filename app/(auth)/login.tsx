import { Redirect } from 'expo-router';
import { useAuth } from '../../src/modules/auth';
import { LoginScreen } from '../../src/modules/auth/components/LoginScreen';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoginScreen />;
}
