import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    // AuthProvider wraps the entire app to provide authentication state globally
    <AuthProvider>
      {/* StatusBar controls the phone's status bar appearance */}
      <StatusBar style="light" />
      {/* Stack navigator manages the screen hierarchy */}
      <Stack
        screenOptions={{
          headerShown: false, // Hide the default header on all screens
          contentStyle: { backgroundColor: '#000000' }, // Black background for all screens
        }}
      >
        {/* (auth) group contains login and signup screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* (tabs) group contains the main app with tab navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
