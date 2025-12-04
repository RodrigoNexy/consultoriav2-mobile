import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/modules/auth';
import { colors } from '../../src/shared/constants/colors';
import { useState } from 'react';
import { Header } from '../../src/shared/components/Header';
import { Sidebar } from '../../src/shared/components/Sidebar';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="checkins"
          options={{
            title: 'Check-ins',
          }}
        />
        <Stack.Screen
          name="training"
          options={{
            title: 'Treinos',
          }}
        />
        <Stack.Screen
          name="diet"
          options={{
            title: 'Dieta',
          }}
        />
        <Stack.Screen
          name="supplements"
          options={{
            title: 'Suplementos',
          }}
        />
        <Stack.Screen
          name="activity"
          options={{
            title: 'Atividade',
          }}
        />
        <Stack.Screen
          name="recovery"
          options={{
            title: 'Recuperação',
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            title: 'Alterar Senha',
          }}
        />
      </Stack>
      <Header onMenuPress={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

