import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { colors } from '../constants/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => setIsSidebarOpen(true)} />
      <View style={styles.content}>{children}</View>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

