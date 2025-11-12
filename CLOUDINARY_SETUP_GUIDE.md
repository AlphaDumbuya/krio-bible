# Cloudinary Setup Guide for Krio Audio Bible

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up (free account - no credit card needed)
3. Verify your email

## Step 2: Get Your Cloudinary Credentials

After login, you'll see your dashboard with:
- **Cloud Name**: (e.g., `dxyz123abc`)
- **API Key**: (e.g., `123456789012345`)
- **API Secret**: (e.g., `abcdefghijklmnop`)

**Copy these - you'll need them!**

## Step 3: Install Cloudinary SDK

```bash
cd KrioAudioBibleApp
npm install cloudinary
```

## Step 4: Create Upload Configuration

Create a file called `cloudinary-credentials.json` with your credentials:

```json
{
  "cloud_name": "YOUR_CLOUD_NAME",
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET"
}
```

**⚠️ IMPORTANT**: Keep this file private! Don't share or commit to Git.

## Step 5: Run Upload Script

I've created `uploadToCloudinary.js` for you. Run:

```bash
node uploadToCloudinary.js
```

This will:
- Upload all 1,152 audio files automatically
- Organize them by book folders
- Show upload progress
- Give you the streaming URLs

## Step 6: Update Your App

After upload completes, the script will show your base URL.
Update `App.js` with your Cloudinary URL (already prepared for you).

## Free Tier Limits

✅ **Storage**: 25 GB (your audio files ~2-3 GB)
✅ **Bandwidth**: 25 GB/month (plenty for testing)
✅ **Transformations**: 25,000/month
✅ **No time limit**: Free forever

## Cloudinary URL Format

Your audio files will be accessible at:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/audio/Matthew/matthew_1.mp3
```

## Benefits of Cloudinary

✅ Fast global CDN (files load quickly worldwide)
✅ Automatic optimization
✅ CORS enabled by default
✅ Reliable uptime
✅ Easy management dashboard
✅ Can delete/update files easily

## Next Steps

1. ✅ Sign up for Cloudinary
2. ✅ Get your credentials (Cloud Name, API Key, API Secret)
3. ✅ Create `cloudinary-credentials.json`
4. ✅ Run `npm install cloudinary`
5. ✅ Run `node uploadToCloudinary.js`
6. ✅ Wait for upload to complete (~30-60 minutes)
7. ✅ App automatically uses Cloudinary URLs
8. ✅ Build and deploy: `npx expo export:web`

---

**Ready?** Get your Cloudinary credentials and let's upload your files!
