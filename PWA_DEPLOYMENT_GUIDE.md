# PWA Deployment Guide - Krio Audio Bible (100% FREE)

## Overview
We'll deploy your app as a Progressive Web App (PWA) that users can:
- Access via web browser
- Install on their phone (works like a native app)
- Use offline after first visit
- No app store needed!

## Free Hosting Options

### **Option 1: Netlify (Recommended - Easiest)**
- **App hosting**: FREE (100GB bandwidth/month)
- **Audio hosting**: Use free tier (supports large files)
- **No credit card needed**

### **Option 2: Vercel + Free CDN**
- **App hosting**: FREE unlimited
- **Audio files**: Host on Internet Archive (free, unlimited)

### **Option 3: GitHub Pages + jsDelivr**
- **App hosting**: FREE
- **Audio files**: GitHub + CDN (free)

---

## 🚀 RECOMMENDED: Netlify Deployment (Simplest)

### Step 1: Prepare Your App for Web Build

1. Install required dependencies:
```bash
cd KrioAudioBibleApp
npm install @expo/webpack-config
```

2. Update `package.json` - add web script if missing:
```json
"scripts": {
  "web": "expo start --web",
  "build:web": "expo export:web"
}
```

### Step 2: Build Your App for Web

```bash
npm run build:web
```

This creates a `web-build` folder with your app ready to deploy.

### Step 3: Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com/drop
2. Drag your `web-build` folder onto the page
3. Done! You get a URL like: `https://krio-audio-bible.netlify.app`

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=web-build
```

### Step 4: Host Audio Files

Since audio files are large, we'll use a free solution:

#### **Option A: Internet Archive (Unlimited Free Storage)**

1. Go to https://archive.org
2. Create free account
3. Upload → New Item
4. Upload all your audio folders
5. Set as "Public Domain" or "Creative Commons"
6. You'll get URLs like: `https://archive.org/download/krio-audio-bible/Matthew/matthew_1.mp3`

#### **Option B: GitHub + jsDelivr CDN (Free)**

1. Create GitHub repo: `krio-audio-files`
2. Upload audio folders to repo
3. Access via jsDelivr CDN:
   - Format: `https://cdn.jsdelivr.net/gh/USERNAME/krio-audio-files/Matthew/matthew_1.mp3`
   - Fast, free, unlimited bandwidth

#### **Option C: Cloudinary (Free 25GB)**

1. Sign up at https://cloudinary.com (free tier)
2. Upload audio files
3. Get permanent URLs for streaming

### Step 5: Update Audio URL in App

Once you have your audio hosting URL, update `App.js` line ~215:

**For Internet Archive:**
```javascript
const AUDIO_BASE_URL = 'https://archive.org/download/YOUR-ITEM-ID';
```

**For jsDelivr/GitHub:**
```javascript
const AUDIO_BASE_URL = 'https://cdn.jsdelivr.net/gh/YOUR-USERNAME/krio-audio-files';
```

**For Cloudinary:**
```javascript
const AUDIO_BASE_URL = 'https://res.cloudinary.com/YOUR-CLOUD-NAME/video/upload';
```

Then rebuild and redeploy:
```bash
npm run build:web
netlify deploy --prod --dir=web-build
```

---

## 📱 Make it Installable (PWA Features)

Your app will automatically be installable on mobile devices! Users can:

1. Visit your website on mobile
2. See "Add to Home Screen" prompt
3. Install it like a native app
4. Use it offline (after first visit)

### Customize PWA Settings

Update `app.json`:
```json
{
  "expo": {
    "name": "Krio Audio Bible",
    "slug": "krio-audio-bible",
    "version": "1.0.0",
    "web": {
      "favicon": "./assets/icon.png",
      "themeColor": "#0a0e27",
      "backgroundColor": "#0a0e27"
    }
  }
}
```

---

## 🎯 Quick Start Commands

```bash
# 1. Install web config
npm install @expo/webpack-config

# 2. Build for web
npm run build:web

# 3. Deploy to Netlify (drag & drop web-build folder)
# Go to: https://app.netlify.com/drop

# 4. Update audio URL in App.js after hosting audio files

# 5. Rebuild and redeploy
npm run build:web
# Upload web-build folder again
```

---

## 💰 Cost Breakdown: **$0.00**

| Service | Cost | What it does |
|---------|------|--------------|
| Netlify | FREE | Hosts your app |
| Internet Archive | FREE | Hosts audio files (unlimited) |
| jsDelivr CDN | FREE | Delivers files fast globally |
| Domain (optional) | $10/year | Custom domain like krioaudiobible.com |

**Total: FREE** (or $10/year with custom domain)

---

## 📊 Traffic Estimates

Free tiers can handle:
- **Netlify**: 100GB bandwidth = ~10,000 visitors/month
- **Internet Archive**: Unlimited downloads
- **jsDelivr**: Unlimited bandwidth

Good for thousands of users!

---

## 🔧 Troubleshooting

**Build fails?**
```bash
npm install --force
npm run build:web
```

**Audio not playing?**
- Check CORS settings on audio host
- Verify audio URLs are accessible
- Check browser console for errors

**Want custom domain?**
- Buy domain from Namecheap ($10/year)
- Point to Netlify in DNS settings
- SSL certificate is automatic

---

## 🎉 Next Steps

1. Run `npm install @expo/webpack-config`
2. Run `npm run build:web`
3. Upload `web-build` folder to Netlify
4. Choose audio hosting solution
5. Update audio URL in code
6. Rebuild and redeploy
7. Share your URL!

**Your app will be live at**: `https://[YOUR-SITE-NAME].netlify.app`

Users can:
✅ Access instantly via browser
✅ Install on home screen
✅ Use offline
✅ No app store needed
✅ Works on iOS and Android

Need help with any step? Let me know!
