import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth, LoginScreen } from '../../src/modules/auth';
import { HomeScreen } from './screens/HomeScreen';
import { CheckInsScreen } from '../../src/modules/checkins/components/CheckInsScreen';
import { ExercisesScreen } from '../../src/modules/exercises/components/ExercisesScreen';
import { TrainingScreen } from '../../src/modules/training/components/TrainingScreen';

export type Screen = 'Login' | 'Home' | 'CheckIns' | 'Exercises' | 'Training';

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

  // Navegação simples baseada em estado
  switch (currentScreen) {
    case 'CheckIns':
      return <CheckInsScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Exercises':
      return <ExercisesScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Training':
      return <TrainingScreen onBack={() => setCurrentScreen('Home')} />;
    case 'Home':
    default:
      return (
        <HomeScreen
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
    backgroundColor: '#ffffff',
  },
});
