# Firebase Setup Guide for Krio Audio Bible

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `krio-audio-bible`
4. Disable Google Analytics (optional) or enable it
5. Click **"Create project"**

## Step 2: Set Up Firebase Storage

1. In your Firebase project, click **"Storage"** in the left sidebar
2. Click **"Get Started"**
3. Choose **"Start in production mode"** (we'll configure rules next)
4. Click **"Next"**
5. Select your Cloud Storage location (choose closest to your users)
6. Click **"Done"**

## Step 3: Configure Storage Rules (Public Read Access)

1. Go to **Storage > Rules** tab
2. Replace the default rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Anyone can read files
      allow write: if false; // Only admins can upload
    }
  }
}
```

3. Click **"Publish"**

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (`</>`) to add a web app
4. Enter app nickname: `Krio Audio Bible Web`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**
7. Copy the `firebaseConfig` object shown. It looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "krio-audio-bible.firebaseapp.com",
  projectId: "krio-audio-bible",
  storageBucket: "krio-audio-bible.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

8. **Save this config** - you'll need it in the next step

## Step 5: Create Firebase Config File

Create a file `firebaseConfig.js` in your project and paste your config:

```javascript
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
```

## Step 6: Get Firebase Admin SDK Key (For Upload Script)

1. Go to **Project Settings > Service Accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** - a JSON file will download
4. **IMPORTANT**: Keep this file secure! Don't share it or commit to Git
5. Rename it to `firebase-admin-key.json`
6. Place it in your `KrioAudioBibleApp` folder

## Step 7: Upload Audio Files

Run the upload script I'll create for you:

```bash
node uploadToFirebase.js
```

This will upload all 1,152 audio files to Firebase Storage (takes about 30-60 minutes depending on your internet speed).

## Step 8: Deploy Your App

Once files are uploaded, your app will automatically stream from Firebase!

### Option A: Deploy as Web App (Expo Web)
```bash
npm run build
```
Then deploy the build folder to:
- **Netlify** (drag & drop, free)
- **Vercel** (connect GitHub, free)
- **Firebase Hosting** (firebase deploy)

### Option B: Build Mobile Apps
```bash
# For Android APK
eas build --platform android

# For iOS
eas build --platform ios
```

## Cost Estimate (Firebase Free Tier)

Firebase Spark Plan (Free):
- **Storage**: 5 GB (your audio files ~2-3 GB ✅)
- **Download**: 1 GB/day (~30-50 chapter plays per day)
- **Bandwidth**: If exceeded, upgrade to Blaze (pay-as-you-go)

For heavy usage, upgrade to **Blaze Plan**:
- $0.026 per GB storage
- $0.12 per GB download
- Estimate: ~$5-20/month for 1000 daily users

## Troubleshooting

**Issue**: Upload script fails with "Permission denied"
- Solution: Check your firebase-admin-key.json is in the correct folder

**Issue**: Files don't play in app
- Solution: Verify Storage Rules allow public read access

**Issue**: "Storage bucket not found"
- Solution: Make sure you've set up Firebase Storage (Step 2)

## Next Steps

1. ✅ Firebase installed
2. ⏳ Create Firebase project (follow steps above)
3. ⏳ Run upload script
4. ✅ App will be updated to use Firebase URLs
5. ⏳ Deploy your app online

---

Need help? Check the Firebase documentation: https://firebase.google.com/docs/storage
