# DealSwapify

A mobile marketplace application for buying, selling, donating, or giving away used items. Built with Expo and React Native, featuring a modern black and green eco-friendly design.

## Features

- **Multiple Transaction Modes**
  - Buyer: Browse and purchase items
  - Seller: Upload items with payment processing
  - Donator: Tag recipients for donations
  - Giveaway: Post free items for public claiming

- **Authentication**
  - Email/password authentication via Supabase
  - Profile management with contact details
  - Secure session handling

- **Payment System**
  - Dynamic fee calculation (5% for images, 9% for videos)
  - Multiple currency support (USD, UGX, ZAR, JPY, CNY)
  - Multiple payment methods (DFCU Bank, Credit Card, MTN MoMo)

- **Advanced Features**
  - Multi-language support (English, Swahili, French, Arabic, Luganda)
  - Location-based filtering
  - Analytics and charts for category visits and mode activity
  - AI validation for category matching
  - WhatsApp integration for direct communication
  - Admin panel for managing store locations

- **Categories**
  - Electronics
  - Furniture
  - Clothes
  - Books
  - Home Appliances
  - Vehicles
  - Tools
  - Sports & Fitness
  - Others

## Tech Stack

- **Frontend**: React Native with Expo SDK 50
- **Navigation**: Expo Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React Native
- **Charts**: React Native Chart Kit
- **Media**: Expo Image Picker
- **Location**: Expo Location

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- A Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dealswapify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database schema has already been created via migration
3. Copy your project URL and anon key from Settings > API

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Application

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
dealswapify/
├── app/                          # Application screens
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── index.tsx           # Home/Categories screen
│   │   ├── profile.tsx
│   │   └── terms.tsx
│   ├── admin/                   # Admin panel
│   │   └── index.tsx
│   ├── category/                # Category detail with tabs
│   │   └── [id].tsx
│   ├── listing/                 # Listing detail
│   │   └── [id].tsx
│   └── _layout.tsx             # Root layout
├── components/                  # Reusable components
│   └── category/
│       ├── BuyerTab.tsx
│       ├── SellerTab.tsx
│       ├── DonatorTab.tsx
│       ├── GiveawayTab.tsx
│       └── AnalyticsSection.tsx
├── contexts/                    # React contexts
│   └── AuthContext.tsx
├── lib/                         # Utilities and configuration
│   ├── supabase.ts
│   ├── types.ts
│   ├── theme.ts
│   └── aiValidation.ts
├── app.json                     # Expo configuration
├── package.json
└── README.md
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles and preferences
- **categories**: Item categories
- **listings**: Items for sale, donation, or giveaway
- **payments**: Payment transactions
- **chats**: In-app messaging
- **notifications**: User notifications
- **store_locations**: Drop-off points for donations
- **analytics_tracking**: User interaction tracking
- **donations**: Donation tracking with recipient information

All tables include Row Level Security (RLS) policies for data protection.

## Key Features Explained

### Seller Payment Logic

- Items with images priced over $3 incur a 5% fee
- Items with videos incur a 9% fee regardless of price
- Payment is required before listing publication
- Supported payment methods are configurable

### AI Validation

The app includes keyword-based validation to ensure items are posted in correct categories. If a mismatch is detected, the system suggests the appropriate category.

### Donation Flow

1. Donor uploads item and tags a recipient via email or WhatsApp
2. System sends notification to recipient
3. GPS-based recommendation for nearest drop-off location
4. Admins manage drop-off locations through the Admin Panel

### Analytics

- Track most visited categories
- Monitor activity across different modes (Buyer/Seller/Donator/Giveaway)
- Visual charts using React Native Chart Kit

## EAS Build Configuration

This project is ready for EAS builds. To build:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android
```

## Android Configuration

The app is configured with:
- Package name: `com.thinktech.dealswapify`
- Required permissions: Location, Camera, Storage
- Adaptive icon with black background

## Customization

### Theme

Edit `lib/theme.ts` to customize colors:

```typescript
export const theme = {
  colors: {
    primary: '#000000',      // Black
    secondary: '#10B981',    // Green
    background: '#000000',
    // ... other colors
  },
  // ... spacing, fonts, etc.
};
```

### Categories

Categories are seeded in the database migration. To modify them, update the migration file or manage them through the Admin Panel (when logged in as admin).

## Security Notes

- All sensitive operations require authentication
- Row Level Security (RLS) is enabled on all tables
- User passwords are encrypted by Supabase Auth
- Two-factor authentication UI is available in profiles

## Terms & Conditions

The app includes comprehensive Terms & Conditions covering:
- Seller payments and upload fees
- Donations and giveaway responsibility
- User data protection
- Prohibited uploads
- Fraud and impersonation policies
- Refund policy

## Support

For issues or questions, contact the admin team through the Admin Panel contact information.

## License

All rights reserved.