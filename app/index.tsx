import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DealSwapify Running</Text>
      <Text style={styles.subtitle}>App is Working!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 16, backgroundColor: '#EF4444' }]}
        onPress={() => router.push('/test')}
      >
        <Text style={styles.buttonText}>Test Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#10B981',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#10B981',
    fontSize: 24,
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
