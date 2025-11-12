# Krio Audio Bible App

A professional mobile application for New Life in Christ Ministry Kossoh Town Chapter.

## Features

- ✅ Complete Old Testament (39 books)
- ✅ Complete New Testament (27 books)
- ✅ Professional audio player with playback controls
- ✅ Beautiful, intuitive user interface
- ✅ Church branding integration
- ✅ Chapter navigation
- ✅ Play/Pause/Stop controls
- ✅ Skip forward/backward (15 seconds)
- ✅ Progress tracking

## Setup Instructions

### 1. Install Dependencies

```bash
cd KrioAudioBibleApp
npm install
```

### 2. Add Church Logo

Upload your church logo to the `assets` folder with these names:
- `church-logo.png` (512x512px) - Main logo displayed in the app
- `icon.png` (1024x1024px) - App icon
- `adaptive-icon.png` (1024x1024px) - Android adaptive icon
- `splash.png` (1284x2778px) - Splash screen
- `favicon.png` (48x48px) - Web favicon

### 3. Link Audio Files

The app is configured to read audio files from the organized folders you created. Ensure the audio files are in:
```
../Krio audio bible new testament/[BookName]/[bookid]_[chapter].mp3
```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in web browser
npm run web
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS App
```bash
expo build:ios
```

## Project Structure

```
KrioAudioBibleApp/
├── assets/              # Images and logos
├── src/
│   ├── data/           # Bible books data
│   ├── screens/        # App screens
│   │   ├── HomeScreen.js
│   │   ├── BooksListScreen.js
│   │   ├── ChaptersListScreen.js
│   │   └── AudioPlayerScreen.js
├── App.js              # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## Color Scheme

The app uses a professional green color scheme representing growth and spirituality:
- Primary: `#1a472a` (Deep Forest Green)
- Secondary: `#2d5f3f` (Medium Forest Green)
- Accent: `#d0e8d8` (Light Mint)
- Background: `#f5f5f5` (Light Gray)

## Support

Made with ❤️ for New Life in Christ Ministry Kossoh Town Chapter

---

**Version:** 1.0.0  
**Last Updated:** November 2025
