import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../lib/theme';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState(profile?.phone || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '');
  const [socialMedia, setSocialMedia] = useState(profile?.social_media || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [city, setCity] = useState(profile?.city || '');
  const [notifyNewUploads, setNotifyNewUploads] = useState(
    profile?.notify_new_uploads || false
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile({
        phone,
        whatsapp,
        social_media: socialMedia,
        country,
        city,
        notify_new_uploads: notifyNewUploads,
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LogOut size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={profile?.email || ''}
            editable={false}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your WhatsApp number"
            placeholderTextColor={theme.colors.textSecondary}
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Social Media Handle</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your social media handle"
            placeholderTextColor={theme.colors.textSecondary}
            value={socialMedia}
            onChangeText={setSocialMedia}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your country"
            placeholderTextColor={theme.colors.textSecondary}
            value={country}
            onChangeText={setCountry}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            placeholderTextColor={theme.colors.textSecondary}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Notify about new uploads</Text>
            <Switch
              value={notifyNewUploads}
              onValueChange={setNotifyNewUploads}
              trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
              thumbColor={theme.colors.text}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>

        {profile?.is_admin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.adminButtonText}>Admin Panel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  signOutButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  adminButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  adminButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});
