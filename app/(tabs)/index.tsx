import { PatientHomeScreen } from '../../src/modules/home/components/PatientHomeScreen';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../../src/modules/auth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'CheckIns':
        router.push('/(tabs)/checkins');
        break;
      case 'Training':
        router.push('/(tabs)/training');
        break;
      case 'Diet':
        router.push('/(tabs)/diet');
        break;
      case 'Supplements':
        router.push('/(tabs)/supplements');
        break;
      case 'Activity':
        router.push('/(tabs)/activity');
        break;
      case 'Recovery':
        router.push('/(tabs)/recovery');
        break;
      case 'ChangePassword':
        router.push('/(tabs)/change-password');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <PatientHomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />;
}
