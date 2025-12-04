import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth, LoginScreen } from '../../src/modules/auth';
import { PatientHomeScreen } from '../../src/modules/home/components/PatientHomeScreen';
import { CheckInsScreen } from '../../src/modules/checkins/components/CheckInsScreen';
import { ExercisesScreen } from '../../src/modules/exercises/components/ExercisesScreen';
import { TrainingScreen } from '../../src/modules/training/components/TrainingScreen';
import { SupplementsScreen } from '../../src/modules/supplements';
import { RecoveryScreen } from '../../src/modules/recovery';
import { DietScreen } from '../../src/modules/nutrition';
import { ActivityScreen } from '../../src/modules/activity';
import { ChangePasswordScreen } from '../../src/modules/change-password';
import { colors } from '../../src/shared/constants/colors';

export type Screen =
  | 'Login'
  | 'Home'
  | 'CheckIns'
  | 'Exercises'
  | 'Training'
  | 'Diet'
  | 'Supplements'
  | 'Activity'
  | 'Recovery'
  | 'ChangePassword';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  switch (currentScreen) {
    case 'CheckIns':
      return <CheckInsScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Exercises':
      return <ExercisesScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Training':
      return <TrainingScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Supplements':
      return <SupplementsScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Recovery':
      return <RecoveryScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Diet':
      return <DietScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Activity':
      return <ActivityScreen onBack={() => setCurrentScreen('Home')} />;
    case 'ChangePassword':
      return <ChangePasswordScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Home':
    default:
      return (
        <PatientHomeScreen
          onNavigate={(screen: Screen) => setCurrentScreen(screen)}
        />
      );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
