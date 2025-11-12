# Analytics Setup Guide

## Track Download Statistics Forever (FREE)

The app now includes Google Analytics 4 (GA4) tracking to monitor:
- Total app installs
- Install button clicks
- User platforms (Android, iOS, Desktop)
- Geographic locations
- Daily/weekly/monthly statistics

### Setup Instructions (5 minutes):

#### Step 1: Create Google Analytics Account
1. Go to https://analytics.google.com/
2. Click "Start measuring"
3. Enter Account name: "Krio Bible App"
4. Click "Next"

#### Step 2: Create Property
1. Property name: "Krio Audio Bible"
2. Select timezone: Your timezone
3. Select currency: Your currency
4. Click "Next"

#### Step 3: Add Data Stream
1. Choose platform: "Web"
2. Website URL: `https://krio-bible.vercel.app`
3. Stream name: "Krio Bible PWA"
4. Click "Create stream"

#### Step 4: Get Measurement ID
1. You'll see a **Measurement ID** like: `G-ABC123DEF4`
2. Copy this ID

#### Step 5: Add to Website
1. Open `web-build/index.html`
2. Find line with: `gtag('config', 'G-XXXXXXXXXX');`
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID
4. Find the script src with: `id=G-XXXXXXXXXX`
5. Replace that one too

#### Step 6: Deploy
```bash
git add web-build/index.html
git commit -m "Add Google Analytics tracking"
git push
```

Vercel will auto-deploy in ~1 minute.

---

## What You'll See in Analytics

### Events Being Tracked:

1. **install_button_clicked** - Someone clicks "Download & Install App"
2. **pwa_install_accepted** - User accepts the install prompt
3. **pwa_install_declined** - User declines the install
4. **pwa_installed** - App successfully installed

### Where to View Stats:

1. Go to https://analytics.google.com/
2. Select "Krio Audio Bible" property
3. **Reports** → **Events** → See all install events
4. **Reports** → **Realtime** → See live users
5. **Reports** → **Acquisition** → See traffic sources
6. **Reports** → **Tech** → See devices & platforms

### Key Metrics Dashboard:

- **Total Installs**: Count of `pwa_installed` events
- **Install Rate**: `pwa_install_accepted` / `install_button_clicked`
- **Platform Breakdown**: Android vs iOS vs Desktop
- **Geographic Data**: Where users are from
- **Time Series**: Installs per day/week/month

---

## Alternative: Simple Counter (Even Easier)

If you just want a simple download counter without detailed analytics:

### Using CountAPI (No signup required):

Add this to your HTML where you want to show the counter:

```html
<div style="text-align: center; margin: 20px;">
    <p style="color: #ff4081; font-size: 1.2em;">
        Total Downloads: <span id="download-count">Loading...</span>
    </p>
</div>

<script>
// Initialize counter on page load
fetch('https://api.countapi.xyz/hit/krio-bible/downloads')
    .then(response => response.json())
    .then(data => {
        document.getElementById('download-count').textContent = data.value;
    });

// Increment on install
window.addEventListener('appinstalled', () => {
    fetch('https://api.countapi.xyz/hit/krio-bible/downloads')
        .then(response => response.json())
        .then(data => console.log('Total downloads:', data.value));
});
</script>
```

This will show a live counter on your page!

---

## Recommendation

**Use Google Analytics** because:
- ✅ Free forever
- ✅ See which countries download most
- ✅ Track Android vs iOS vs Desktop
- ✅ See daily/weekly trends
- ✅ Professional analytics dashboard
- ✅ Export data to Excel/Sheets
- ✅ Set up custom alerts
- ✅ No coding needed after setup

The setup takes only 5 minutes and gives you lifetime tracking!
