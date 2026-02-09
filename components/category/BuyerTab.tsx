import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../lib/theme';
import { Listing } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { MessageCircle, ExternalLink } from 'lucide-react-native';

interface BuyerTabProps {
  categoryId: string;
}

export default function BuyerTab({ categoryId }: BuyerTabProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadListings();
  }, [categoryId]);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category_id', categoryId)
        .eq('listing_type', 'sale')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppChat = (listing: Listing) => {
    Linking.openURL(`whatsapp://send?phone=${listing.pickup_location}`);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/listing/[id]',
          params: { id: item.id },
        })
      }
    >
      {item.media_url && (
        <Image source={{ uri: item.media_url }} style={styles.image} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {item.currency} {item.price.toFixed(2)}
          </Text>
          {item.condition && (
            <Text style={styles.condition}>{item.condition}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleWhatsAppChat(item)}
          >
            <MessageCircle size={16} color={theme.colors.secondary} />
            <Text style={styles.actionText}>Chat on WhatsApp</Text>
          </TouchableOpacity>
          {item.external_link && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Linking.openURL(item.external_link!)}
            >
              <ExternalLink size={16} color={theme.colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No uploads yet</Text>
        <Text style={styles.emptySubtext}>
          Be the first to list an item in this category
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 200,
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
    marginBottom: theme.spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  price: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  condition: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
});
