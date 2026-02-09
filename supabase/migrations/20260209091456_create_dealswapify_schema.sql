/*
  # DealSwapify Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `phone` (text)
      - `whatsapp` (text)
      - `social_media` (text)
      - `language` (text, default 'English')
      - `country` (text)
      - `city` (text)
      - `is_admin` (boolean, default false)
      - `notify_new_uploads` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `visit_count` (integer, default 0)
      - `created_at` (timestamptz)
    
    - `listings`
      - `id` (uuid, primary key)
      - `seller_id` (uuid, references profiles)
      - `category_id` (uuid, references categories)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `currency` (text)
      - `condition` (text)
      - `listing_type` (text: 'sale', 'donation', 'giveaway')
      - `media_type` (text: 'image', 'video')
      - `media_url` (text)
      - `external_link` (text)
      - `status` (text, default 'active')
      - `pickup_location` (text)
      - `deadline` (timestamptz)
      - `ai_validated` (boolean, default false)
      - `suggested_category_id` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payments`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `seller_id` (uuid, references profiles)
      - `amount` (decimal)
      - `currency` (text)
      - `payment_method` (text)
      - `payment_status` (text, default 'pending')
      - `transaction_id` (text)
      - `created_at` (timestamptz)
    
    - `chats`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `buyer_id` (uuid, references profiles)
      - `seller_id` (uuid, references profiles)
      - `message` (text)
      - `created_at` (timestamptz)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `title` (text)
      - `message` (text)
      - `read` (boolean, default false)
      - `listing_id` (uuid)
      - `created_at` (timestamptz)
    
    - `store_locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `country` (text)
      - `city` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `created_at` (timestamptz)
    
    - `analytics_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_type` (text)
      - `category_id` (uuid)
      - `listing_id` (uuid)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `donations`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `donor_id` (uuid, references profiles)
      - `recipient_email` (text)
      - `recipient_whatsapp` (text)
      - `status` (text, default 'pending')
      - `notified_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  whatsapp text,
  social_media text,
  language text DEFAULT 'English',
  country text,
  city text,
  is_admin boolean DEFAULT false,
  notify_new_uploads boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  visit_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  condition text,
  listing_type text NOT NULL CHECK (listing_type IN ('sale', 'donation', 'giveaway')),
  media_type text CHECK (media_type IN ('image', 'video')),
  media_url text,
  external_link text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'rejected')),
  pickup_location text,
  deadline timestamptz,
  ai_validated boolean DEFAULT false,
  suggested_category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Sellers can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chats they are part of"
  ON chats FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can send messages"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create store_locations table
CREATE TABLE IF NOT EXISTS store_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  country text NOT NULL,
  city text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view store locations"
  ON store_locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage store locations"
  ON store_locations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Create analytics_tracking table
CREATE TABLE IF NOT EXISTS analytics_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create analytics events"
  ON analytics_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view analytics"
  ON analytics_tracking FOR SELECT
  TO authenticated
  USING (true);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  donor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_email text,
  recipient_whatsapp text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'completed')),
  notified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = donor_id);

CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Electronics', 'Phones, laptops, tablets, and electronic devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
  ('Furniture', 'Tables, chairs, sofas, and home furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'),
  ('Clothes', 'Clothing, shoes, and fashion accessories', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'),
  ('Books', 'Books, magazines, and reading materials', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'),
  ('Home Appliances', 'Kitchen appliances, washing machines, and home equipment', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'),
  ('Vehicles', 'Cars, motorcycles, bicycles, and transportation', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'),
  ('Tools', 'Hand tools, power tools, and equipment', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400'),
  ('Sports & Fitness', 'Sports equipment, gym gear, and fitness accessories', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'),
  ('Others', 'Everything else that does not fit other categories', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400')
ON CONFLICT (name) DO NOTHING;
