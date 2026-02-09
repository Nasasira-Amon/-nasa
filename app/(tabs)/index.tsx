import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../lib/theme';
import { Category, LANGUAGES } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Globe } from 'lucide-react-native';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('');
  const router = useRouter();
  const { profile, updateProfile } = useAuth();

  useEffect(() => {
    loadCategories();
    if (profile) {
      setLanguage(profile.language);
      setCountry(profile.country || '');
    }
  }, [profile]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: Category) => {
    await supabase
      .from('categories')
      .update({ visit_count: category.visit_count + 1 })
      .eq('id', category.id);

    router.push({
      pathname: '/category/[id]',
      params: { id: category.id, name: category.name },
    });
  };

  const handleLanguageChange = async (value: string) => {
    setLanguage(value);
    if (profile) {
      await updateProfile({ language: value });
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
        <Text style={styles.title}>DealSwapify</Text>
        <Text style={styles.subtitle}>Buy, Sell, Donate, or Give Away</Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <View style={styles.filterLabel}>
            <Globe size={16} color={theme.colors.secondary} />
            <Text style={styles.filterLabelText}>Language</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={language}
              onValueChange={handleLanguageChange}
              style={styles.picker}
              dropdownIconColor={theme.colors.text}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item key={lang} label={lang} value={lang} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <View style={styles.filterLabel}>
            <MapPin size={16} color={theme.colors.secondary} />
            <Text style={styles.filterLabelText}>Location</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.locationButtonText}>
              {country || 'Set Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.card}
              onPress={() => handleCategoryPress(category)}
            >
              <Image
                source={{ uri: category.image_url || '' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{category.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {category.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  filters: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterItem: {
    marginBottom: theme.spacing.sm,
  },
  filterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  filterLabelText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  picker: {
    color: theme.colors.text,
  },
  locationButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
  },
  locationButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    padding: theme.spacing.md,
  },
  grid: {
    padding: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
