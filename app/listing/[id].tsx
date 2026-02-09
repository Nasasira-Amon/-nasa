import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../lib/theme';
import { Listing } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, MapPin, ExternalLink, MessageCircle } from 'lucide-react-native';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {listing.media_url && (
          <Image source={{ uri: listing.media_url }} style={styles.image} />
        )}

        <View style={styles.details}>
          {listing.listing_type === 'giveaway' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FREE GIVEAWAY</Text>
            </View>
          )}

          <Text style={styles.title}>{listing.title}</Text>

          {listing.listing_type === 'sale' && (
            <Text style={styles.price}>
              {listing.currency} {listing.price.toFixed(2)}
            </Text>
          )}

          {listing.condition && (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{listing.condition}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>

          {listing.pickup_location && (
            <>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={theme.colors.secondary} />
                <Text style={styles.locationText}>{listing.pickup_location}</Text>
              </View>
            </>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Linking.openURL(`whatsapp://send?phone=${listing.pickup_location}`)}
            >
              <MessageCircle size={20} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>Chat on WhatsApp</Text>
            </TouchableOpacity>

            {listing.external_link && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => Linking.openURL(listing.external_link!)}
              >
                <ExternalLink size={20} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>View Link</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Posted: {new Date(listing.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.metadataText}>
              Type: {listing.listing_type.charAt(0).toUpperCase() + listing.listing_type.slice(1)}
            </Text>
          </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.error,
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
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  details: {
    padding: theme.spacing.lg,
  },
  badge: {
    backgroundColor: theme.colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.md,
  },
  conditionBadge: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  conditionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  metadata: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  metadataText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
