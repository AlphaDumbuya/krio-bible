// Service Worker for Krio Audio Bible
// Provides true offline audio caching

const CACHE_NAME = 'krio-audio-bible-v4';
const AUDIO_CACHE_NAME = 'krio-audio-files-v4';

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.html',
        '/manifest.json',
        '/_expo/static/js/web/AppEntry-1bf10fdb1aacf8a095ec7874899376cf.js',
        '/assets/assets/nlicm-logo.f965c92be117cc700704824a732689cc.jpg'
      ]).catch((error) => {
        console.error('Failed to cache files:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Cloudinary audio files
  if (url.hostname === 'res.cloudinary.com' && url.pathname.includes('/audio/')) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            console.log('Serving audio from cache:', url.pathname);
            return response;
          }
          
          // Not in cache, fetch from network and cache it
          return fetch(event.request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              console.log('Caching audio file:', url.pathname);
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((error) => {
            console.error('Failed to fetch audio:', error);
            throw error;
          });
        });
      })
    );
    return;
  }
  
  // Handle other requests (app files)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Cache successful responses for future offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch((error) => {
        // If offline and not in cache, return app.html as fallback
        console.log('Offline - serving from cache:', error);
        return caches.match('/app.html');
      });
    })
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const audioUrl = event.data.url;
    
    // Pre-cache audio file
    event.waitUntil(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return fetch(audioUrl).then((response) => {
          if (response && response.status === 200) {
            console.log('Pre-caching audio:', audioUrl);
            return cache.put(audioUrl, response);
          }
        });
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(AUDIO_CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        event.ports[0].postMessage({
          type: 'CACHE_SIZE',
          count: keys.length
        });
      });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(AUDIO_CACHE_NAME).then(() => {
        console.log('Audio cache cleared');
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED'
        });
      })
    );
  }
});
