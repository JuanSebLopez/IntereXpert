import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './services/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function AppRoot() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 