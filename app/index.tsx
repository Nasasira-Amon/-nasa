import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../lib/theme';

// This is the app's entry point - it decides where to route the user
export default function Index() {
  // Get authentication state from AuthContext
  const { session, loading } = useAuth();

  // While checking auth status, show a loading spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  // If user is logged in, redirect to the main app tabs
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not logged in, redirect to the login screen
  return <Redirect href="/(auth)/login" />;
}
