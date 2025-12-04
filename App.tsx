import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/modules/auth';
import { AppNavigator } from './app/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
