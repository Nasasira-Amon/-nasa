# DealSwapify Setup Guide

Complete setup instructions for getting DealSwapify running on your development machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install with: `npm install -g expo-cli`
- **Git** - [Download](https://git-scm.com/)
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd dealswapify
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter any errors, try:

```bash
npm install --legacy-peer-deps
```

### 3. Supabase Configuration

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in
4. Create a new project:
   - Choose a project name
   - Set a strong database password
   - Select a region close to your users
   - Wait for the project to be provisioned (2-3 minutes)

#### Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

#### Configure Environment Variables

The `.env` file already exists with Supabase credentials. The database schema has been automatically applied.

### 4. Database Setup

The database schema is already configured through migrations. The following tables have been created:

- profiles
- categories (with default data)
- listings
- payments
- chats
- notifications
- store_locations
- analytics_tracking
- donations

All tables have Row Level Security (RLS) enabled with appropriate policies.

### 5. Create Placeholder Assets

Create the following files in the `assets/` directory:

1. **icon.png** (1024x1024px) - App icon with black background and green accent
2. **adaptive-icon.png** (1024x1024px) - Android adaptive icon
3. **splash.png** (1242x2436px) - Splash screen with black background
4. **favicon.png** (48x48px) - Web favicon

See `assets/README.md` for detailed asset requirements.

### 6. Start the Development Server

```bash
npm start
```

This will:
- Start the Expo development server
- Open Expo Dev Tools in your browser
- Show a QR code for testing on physical devices

### 7. Run on Device/Emulator

#### Option A: Physical Device

1. Install **Expo Go** app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code from the terminal or browser
3. The app will load on your device

#### Option B: iOS Simulator (macOS only)

```bash
npm run ios
```

Requirements:
- Xcode installed
- iOS Simulator set up

#### Option C: Android Emulator

```bash
npm run android
```

Requirements:
- Android Studio installed
- Android SDK configured
- Virtual device created in AVD Manager

### 8. Test the Application

1. **Create an account**: Use the signup screen
2. **Browse categories**: View the 9 default categories
3. **Create a listing**: Go to a category and use the Seller tab
4. **Test payment flow**: Try uploading with an image or video
5. **Explore other modes**: Try Donator and Giveaway tabs

## Common Issues and Solutions

### Issue: Metro bundler fails to start

**Solution:**
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Issue: Module not found errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Supabase connection errors

**Solution:**
1. Verify your `.env` file has correct credentials
2. Check your Supabase project is active
3. Ensure you're not using expired API keys

### Issue: Android build fails

**Solution:**
1. Make sure Android SDK is properly installed
2. Set ANDROID_HOME environment variable
3. Accept all SDK licenses:
   ```bash
   cd $ANDROID_HOME/tools/bin
   ./sdkmanager --licenses
   ```

### Issue: iOS simulator not opening

**Solution:**
1. Open Xcode and install required components
2. Open Simulator manually from Applications
3. Try running `npm run ios` again

## Development Tips

### Hot Reload

Expo supports hot reloading. Changes to your code will automatically reflect in the app. If hot reload isn't working:

- Shake your device (physical) or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
- Enable "Fast Refresh" in the developer menu

### Debugging

1. **Console Logs**: View in terminal or Expo Dev Tools
2. **React DevTools**: Press `Shift+M` in terminal to open
3. **Element Inspector**: Shake device > "Show Element Inspector"

### Testing Authentication

Use these test accounts or create new ones:
- Email format: `test@example.com`
- Password: At least 6 characters

### Testing Admin Features

To test admin features:
1. Create a user account
2. Manually update the `is_admin` flag in Supabase:
   - Go to Supabase Dashboard > Table Editor > profiles
   - Find your user
   - Set `is_admin` to `true`
3. Restart the app and access Admin Panel from Profile tab

## Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Production Build

```bash
eas build --platform android --profile production
```

The build will be processed on Expo's servers. You'll receive a download link when complete.

## Next Steps

After setup:

1. **Customize the theme** in `lib/theme.ts`
2. **Add your own categories** or modify existing ones
3. **Configure payment providers** (currently using mock implementation)
4. **Set up push notifications** (optional)
5. **Add analytics tracking** (optional)
6. **Configure deep linking** for better UX

## Getting Help

If you encounter issues:

1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Check existing issues in the repository
4. Create a new issue with detailed error information

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Lucide Icons](https://lucide.dev/)

## License

All rights reserved.
