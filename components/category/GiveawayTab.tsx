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
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../lib/theme';
import { Listing } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, ExternalLink, Upload, Image as ImageIcon, Video } from 'lucide-react-native';

interface GiveawayTabProps {
  categoryId: string;
}

export default function GiveawayTab({ categoryId }: GiveawayTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUri, setMediaUri] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadListings();
  }, [categoryId]);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category_id', categoryId)
        .eq('listing_type', 'giveaway')
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

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'image'
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('listings').insert({
        seller_id: user?.id,
        category_id: categoryId,
        title,
        description,
        price: 0,
        currency: 'USD',
        condition,
        listing_type: 'giveaway',
        media_type: mediaType,
        media_url: mediaUri,
        external_link: externalLink,
        status: 'active',
      });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setCondition('');
      setMediaUri('');
      setExternalLink('');
      setShowForm(false);

      Alert.alert('Success', 'Giveaway created successfully!');
      loadListings();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>FREE</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.condition && (
          <Text style={styles.condition}>{item.condition}</Text>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleWhatsAppChat(item)}
          >
            <MessageCircle size={16} color={theme.colors.secondary} />
            <Text style={styles.actionText}>Chat</Text>
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

  if (showForm) {
    return (
      <ScrollView style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.infoText}>
            Post a free giveaway item. Anyone can claim it!
          </Text>

          <Text style={styles.label}>Item Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="What are you giving away?"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the item"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Condition</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Good, Fair"
            placeholderTextColor={theme.colors.textSecondary}
            value={condition}
            onChangeText={setCondition}
          />

          <Text style={styles.label}>Media Type</Text>
          <View style={styles.mediaTypeRow}>
            <TouchableOpacity
              style={[
                styles.mediaTypeButton,
                mediaType === 'image' && styles.mediaTypeButtonActive,
              ]}
              onPress={() => setMediaType('image')}
            >
              <ImageIcon
                size={20}
                color={
                  mediaType === 'image'
                    ? theme.colors.secondary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.mediaTypeText,
                  mediaType === 'image' && styles.mediaTypeTextActive,
                ]}
              >
                Image
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mediaTypeButton,
                mediaType === 'video' && styles.mediaTypeButtonActive,
              ]}
              onPress={() => setMediaType('video')}
            >
              <Video
                size={20}
                color={
                  mediaType === 'video'
                    ? theme.colors.secondary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.mediaTypeText,
                  mediaType === 'video' && styles.mediaTypeTextActive,
                ]}
              >
                Video
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
            <Upload size={20} color={theme.colors.text} />
            <Text style={styles.uploadButtonText}>
              {mediaUri ? 'Change Media' : 'Upload Media'}
            </Text>
          </TouchableOpacity>

          {mediaUri && mediaType === 'image' && (
            <Image source={{ uri: mediaUri }} style={styles.preview} />
          )}

          <Text style={styles.label}>External Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional: TikTok, Website URL"
            placeholderTextColor={theme.colors.textSecondary}
            value={externalLink}
            onChangeText={setExternalLink}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Posting...' : 'Post Giveaway'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.createButtonText}>+ Create Giveaway</Text>
      </TouchableOpacity>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No giveaways yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to post a free item!
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  createButton: {
    backgroundColor: theme.colors.secondary,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  createButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
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
  badge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
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
  condition: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
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
  form: {
    padding: theme.spacing.lg,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mediaTypeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  mediaTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  mediaTypeButtonActive: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.card,
  },
  mediaTypeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  mediaTypeTextActive: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  uploadButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});
