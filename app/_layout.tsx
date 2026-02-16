import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';

// CRITICAL: Root layout that initializes the entire app
export default function RootLayout() {
  // REQUIRED: This hook ensures Expo framework is ready before rendering
  // DO NOT REMOVE - Essential for proper app initialization
  useFrameworkReady();

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
        {/* Entry point that routes based on auth state */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* (auth) group contains login and signup screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* (tabs) group contains the main app with tab navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Category detail pages */}
        <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
        {/* Listing detail pages */}
        <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
        {/* Admin panel */}
        <Stack.Screen name="admin/index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
