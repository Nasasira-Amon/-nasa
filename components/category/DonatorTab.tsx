import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Image as ImageIcon, Video } from 'lucide-react-native';

interface DonatorTabProps {
  categoryId: string;
}

export default function DonatorTab({ categoryId }: DonatorTabProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUri, setMediaUri] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientWhatsApp, setRecipientWhatsApp] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleDonate = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    if (!recipientEmail && !recipientWhatsApp) {
      Alert.alert('Error', 'Please provide recipient email or WhatsApp number');
      return;
    }

    setLoading(true);
    try {
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          seller_id: user?.id,
          category_id: categoryId,
          title,
          description,
          price: 0,
          currency: 'USD',
          condition,
          listing_type: 'donation',
          media_type: mediaType,
          media_url: mediaUri,
          external_link: externalLink,
          status: 'active',
        })
        .select()
        .single();

      if (listingError) throw listingError;

      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          listing_id: listing.id,
          donor_id: user?.id,
          recipient_email: recipientEmail || null,
          recipient_whatsapp: recipientWhatsApp || null,
          status: 'pending',
        });

      if (donationError) throw donationError;

      const { data: storeLocations } = await supabase
        .from('store_locations')
        .select('*')
        .limit(1);

      let message = `You've been tagged for a donation: ${title}`;
      if (storeLocations && storeLocations.length > 0) {
        message += `\n\nNearest drop-off location: ${storeLocations[0].name}, ${storeLocations[0].address}`;
      }

      setTitle('');
      setDescription('');
      setCondition('');
      setMediaUri('');
      setExternalLink('');
      setRecipientEmail('');
      setRecipientWhatsApp('');

      Alert.alert(
        'Success',
        'Donation created! Recipient will be notified.\n\n' +
          (storeLocations && storeLocations.length > 0
            ? `Recommended drop-off: ${storeLocations[0].name}`
            : 'Check Admin Panel for drop-off locations')
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.infoText}>
          Tag a specific recipient for your donation. They will be notified via email
          or WhatsApp.
        </Text>

        <Text style={styles.label}>Item Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="What are you donating?"
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
          placeholder="e.g., Good, Fair, Needs Repair"
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

        <View style={styles.recipientSection}>
          <Text style={styles.sectionTitle}>Recipient Information</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient's email"
            placeholderTextColor={theme.colors.textSecondary}
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>WhatsApp Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient's WhatsApp number"
            placeholderTextColor={theme.colors.textSecondary}
            value={recipientWhatsApp}
            onChangeText={setRecipientWhatsApp}
            keyboardType="phone-pad"
          />

          <Text style={styles.helperText}>
            Provide at least one contact method for the recipient
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleDonate}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Processing...' : 'Create Donation'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  recipientSection: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  helperText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
