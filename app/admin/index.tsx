import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../lib/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, MapPin, Plus } from 'lucide-react-native';

export default function AdminPanel() {
  const { profile } = useAuth();
  const router = useRouter();
  const [storeLocations, setStoreLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (!profile?.is_admin) {
      Alert.alert('Access Denied', 'You do not have admin privileges');
      router.back();
      return;
    }
    loadStoreLocations();
  }, [profile]);

  const loadStoreLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStoreLocations(data || []);
    } catch (error) {
      console.error('Error loading store locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!name || !address || !country) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const { error } = await supabase.from('store_locations').insert({
        name,
        address,
        country,
        city: city || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      });

      if (error) throw error;

      setName('');
      setAddress('');
      setCountry('');
      setCity('');
      setLatitude('');
      setLongitude('');
      setShowForm(false);

      Alert.alert('Success', 'Store location added successfully');
      loadStoreLocations();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Store Locations</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(!showForm)}
            >
              <Plus size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.form}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Store name"
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Full address"
                placeholderTextColor={theme.colors.textSecondary}
                value={address}
                onChangeText={setAddress}
              />

              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor={theme.colors.textSecondary}
                value={country}
                onChangeText={setCountry}
              />

              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor={theme.colors.textSecondary}
                value={city}
                onChangeText={setCity}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.0"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.0"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddLocation}
              >
                <Text style={styles.submitButtonText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.locationsList}>
            {storeLocations.map((location) => (
              <View key={location.id} style={styles.locationCard}>
                <MapPin size={20} color={theme.colors.secondary} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                  <Text style={styles.locationDetails}>
                    {location.city && `${location.city}, `}
                    {location.country}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Contact Info</Text>
          <Text style={styles.infoText}>
            Users can contact admins for guidance on drop-off locations and other
            support. Make sure store locations are up to date.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  locationsList: {
    gap: theme.spacing.sm,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationAddress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  locationDetails: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    lineHeight: 20,
  },
});
