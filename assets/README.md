# Assets Directory

This directory contains placeholder assets for the DealSwapify mobile app.

## Required Assets

The following assets are required for the app to function properly:

### App Icons

- `icon.png` - Main app icon (1024x1024px)
- `adaptive-icon.png` - Android adaptive icon foreground (1024x1024px)
- `favicon.png` - Web favicon (48x48px)

### Splash Screen

- `splash.png` - App splash screen (1242x2436px for iPhone X)

## Asset Requirements

### Icon (icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Background: Black (#000000)
- Contains: Green leaf icon representing eco-friendliness

### Adaptive Icon (adaptive-icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe zone: Keep important content within center 66% (684x684px)
- Background color defined in app.json: #000000 (black)

### Splash Screen (splash.png)
- Minimum size: 1242x2436 pixels
- Format: PNG
- Background: Black (#000000)
- Contains: App logo and name centered
- Resize mode: contain (defined in app.json)

### Favicon (favicon.png)
- Size: 48x48 pixels
- Format: PNG
- Simple version of the app icon

## Creating Assets

You can create these assets using:
- Adobe Illustrator / Photoshop
- Figma
- Sketch
- Online icon generators

### Quick Start with Placeholder Assets

For development purposes, you can create simple placeholder assets:

1. **Icon**: Black square with a green leaf emoji or simple green circle
2. **Adaptive Icon**: Same as icon but ensure content is in safe zone
3. **Splash**: Black background with "DealSwapify" text in white and a green accent
4. **Favicon**: Simplified 48x48 version of the icon

## Icon Guidelines

Follow these guidelines for production assets:
- Use vector graphics when possible
- Maintain high contrast for visibility
- Keep designs simple and recognizable at small sizes
- Test on both light and dark backgrounds
- Ensure the icon represents the eco-friendly marketplace theme

## Color Palette

Use these colors from the app theme:
- Primary Black: #000000
- Secondary Green: #10B981
- White: #FFFFFF
- Dark Gray: #1a1a1a

## Testing Assets

After adding/updating assets:
1. Clear Expo cache: `expo start -c`
2. Rebuild the app
3. Test on both iOS and Android devices
4. Check how icons appear in different contexts (home screen, app switcher, etc.)
