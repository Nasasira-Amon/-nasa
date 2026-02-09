export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  social_media: string | null;
  language: string;
  country: string | null;
  city: string | null;
  is_admin: boolean;
  notify_new_uploads: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  visit_count: number;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: string | null;
  listing_type: 'sale' | 'donation' | 'giveaway';
  media_type: 'image' | 'video' | null;
  media_url: string | null;
  external_link: string | null;
  status: 'active' | 'sold' | 'expired' | 'rejected';
  pickup_location: string | null;
  deadline: string | null;
  ai_validated: boolean;
  suggested_category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  listing_id: string | null;
  seller_id: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id: string | null;
  created_at: string;
}

export interface Chat {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  message: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  listing_id: string | null;
  created_at: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  country: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface Donation {
  id: string;
  listing_id: string;
  donor_id: string;
  recipient_email: string | null;
  recipient_whatsapp: string | null;
  status: 'pending' | 'notified' | 'completed';
  notified_at: string | null;
  created_at: string;
}

export const LANGUAGES = ['English', 'Swahili', 'French', 'Arabic', 'Luganda'];
export const CURRENCIES = ['USD', 'UGX', 'ZAR', 'JPY', 'CNY'];
export const PAYMENT_METHODS = ['DFCU Bank', 'Credit Card', 'MTN MoMo'];
