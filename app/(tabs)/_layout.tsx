import { Tabs } from 'expo-router';
import { Home, User, Settings, FileText } from 'lucide-react-native';
import { theme } from '../../lib/theme';

// This layout defines the bottom tab navigation for logged-in users
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the top header bar
        tabBarStyle: {
          // Customize the bottom tab bar appearance
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        // Green color for active tab, gray for inactive
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      {/* Home tab - shows the 9 marketplace categories */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      {/* Profile tab - user profile and settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {/* Terms tab - terms and conditions */}
      <Tabs.Screen
        name="terms"
        options={{
          title: 'Terms',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
