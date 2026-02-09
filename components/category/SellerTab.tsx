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
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../lib/theme';
import { CURRENCIES, PAYMENT_METHODS } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Image as ImageIcon, Video } from 'lucide-react-native';

interface SellerTabProps {
  categoryId: string;
}

export default function SellerTab({ categoryId }: SellerTabProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [condition, setCondition] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUri, setMediaUri] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
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

  const calculateFee = () => {
    const priceNum = parseFloat(price) || 0;
    if (mediaType === 'image' && priceNum > 3) {
      return priceNum * 0.05;
    } else if (mediaType === 'video') {
      return priceNum * 0.09;
    }
    return 0;
  };

  const handlePayment = () => {
    const fee = calculateFee();
    if (fee === 0) {
      handleUpload();
      return;
    }

    Alert.alert(
      'Payment Required',
      `A fee of ${currency} ${fee.toFixed(2)} is required to upload this listing.\n\nSelect payment method:`,
      [
        ...PAYMENT_METHODS.map((method) => ({
          text: method,
          onPress: () => processPayment(method, fee),
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const processPayment = async (method: string, amount: number) => {
    setLoading(true);
    try {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          seller_id: user?.id,
          amount,
          currency,
          payment_method: method,
          payment_status: 'completed',
          transaction_id: `TXN${Date.now()}`,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      await handleUpload(payment.id);
      Alert.alert('Success', 'Payment processed and listing uploaded!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (paymentId?: string) => {
    if (!title || !description || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('listings').insert({
        seller_id: user?.id,
        category_id: categoryId,
        title,
        description,
        price: parseFloat(price),
        currency,
        condition,
        listing_type: 'sale',
        media_type: mediaType,
        media_url: mediaUri,
        external_link: externalLink,
        pickup_location: pickupLocation,
        status: 'active',
      });

      if (error) throw error;

      setTitle('');
      setDescription('');
      setPrice('');
      setCondition('');
      setMediaUri('');
      setExternalLink('');
      setPickupLocation('');

      Alert.alert('Success', 'Listing created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Item title"
          placeholderTextColor={theme.colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Item description"
          placeholderTextColor={theme.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Price *</Text>
        <View style={styles.row}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currency}
              onValueChange={setCurrency}
              style={styles.picker}
              dropdownIconColor={theme.colors.text}
            >
              {CURRENCIES.map((curr) => (
                <Picker.Item key={curr} label={curr} value={curr} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.label}>Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., New, Like New, Good, Fair"
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
          placeholder="TikTok, WhatsApp Business, Website URL"
          placeholderTextColor={theme.colors.textSecondary}
          value={externalLink}
          onChangeText={setExternalLink}
        />

        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Where can buyers pick up the item?"
          placeholderTextColor={theme.colors.textSecondary}
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />

        {calculateFee() > 0 && (
          <View style={styles.feeInfo}>
            <Text style={styles.feeText}>
              Upload Fee: {currency} {calculateFee().toFixed(2)}
            </Text>
            <Text style={styles.feeSubtext}>
              {mediaType === 'image' ? '5%' : '9%'} of item price
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Processing...' : 'Create Listing'}
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
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  picker: {
    color: theme.colors.text,
  },
  priceInput: {
    flex: 2,
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
  feeInfo: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  feeText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  feeSubtext: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
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
