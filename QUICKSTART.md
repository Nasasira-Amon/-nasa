# DealSwapify Quick Start Guide

Get up and running with DealSwapify in 5 minutes!

## Prerequisites

- Node.js installed
- npm or yarn
- Expo Go app on your phone (optional)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

The `.env` file is already configured with Supabase credentials. The database schema has been automatically set up.

### 3. Start the App

```bash
npm start
```

### 4. Open on Device

**Option A: Physical Device**
- Install Expo Go from App Store or Google Play
- Scan the QR code shown in terminal

**Option B: Emulator**
```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
```

## First Steps in the App

1. **Sign Up**: Create a new account on the signup screen
2. **Browse Categories**: View the 9 available categories
3. **Create a Listing**:
   - Tap any category
   - Switch to "Seller" tab
   - Fill in item details
   - Upload and publish

## Default Categories

- Electronics
- Furniture
- Clothes
- Books
- Home Appliances
- Vehicles
- Tools
- Sports & Fitness
- Others

## Testing Features

### Test Seller Mode
1. Go to any category
2. Tap "Seller" tab
3. Upload an item with price > $3 to see payment flow
4. Try both image and video options to see different fees

### Test Donator Mode
1. Go to any category
2. Tap "Donator" tab
3. Fill in recipient email or WhatsApp
4. Create donation

### Test Giveaway Mode
1. Go to any category
2. Tap "Giveaway" tab
3. Post a free item

### Access Admin Panel
1. Go to Profile tab
2. Manually set `is_admin=true` in Supabase for your user
3. Refresh app
4. "Admin Panel" button will appear

## Common Commands

```bash
# Start development server
npm start

# Clear cache
npm start -- --reset-cache

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure (Simplified)

```
app/
  (auth)/          → Login & Signup
  (tabs)/          → Home, Profile, Terms
  category/        → Category detail with 4 tabs
  listing/         → Individual listing view
  admin/           → Admin panel

components/
  category/        → Tab components
  common/          → Reusable UI

lib/
  supabase.ts      → Database client
  types.ts         → TypeScript types
  theme.ts         → Colors & styling
```

## Key Files to Know

- `lib/theme.ts` - Customize colors and styling
- `lib/types.ts` - All TypeScript interfaces
- `.env` - Supabase configuration
- `app.json` - Expo configuration

## Customization Quick Tips

### Change Colors
Edit `lib/theme.ts`:
```typescript
colors: {
  primary: '#000000',    // Change main color
  secondary: '#10B981',  // Change accent color
}
```

### Add New Category
1. Go to Supabase dashboard
2. Open `categories` table
3. Insert new row with name, description, image_url

### Change Payment Fees
Edit `components/category/SellerTab.tsx`:
```typescript
// Change these percentages
if (mediaType === 'image' && priceNum > 3) {
  return priceNum * 0.05;  // 5% fee
} else if (mediaType === 'video') {
  return priceNum * 0.09;  // 9% fee
}
```

## Troubleshooting

**Can't connect to Supabase?**
- Check `.env` file has correct credentials
- Verify Supabase project is active

**App won't start?**
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**Build errors?**
- Make sure all dependencies are installed
- Check Node.js version (needs v16+)
- Try `npm install --legacy-peer-deps`

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Read `README.md` for full documentation
- Review `PROJECT_SUMMARY.md` for architecture details

## What's Next?

After basic testing:

1. **Add Custom Assets**: Replace icons in `assets/` folder
2. **Configure Payments**: Integrate real payment provider
3. **Enable Notifications**: Set up push notifications
4. **Build APK**: Use `eas build` for production builds

## Ready to Deploy?

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android
```

---

**That's it! You're ready to start using DealSwapify.** 🚀

For detailed information, see the full documentation in `README.md` and `SETUP.md`.
