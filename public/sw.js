const CACHE_NAME = 'soundfonts-cache-v1';
const SOUNDFONTS = [
  '/soundfonts/MusyngKite/acoustic_grand_piano-mp3.js',
  '/soundfonts/MusyngKite/acoustic_guitar_nylon-mp3.js',
  '/soundfonts/MusyngKite/banjo-mp3.js',
  '/soundfonts/MusyngKite/kalimba-mp3.js',
  '/soundfonts/MusyngKite/lead_1_square-mp3.js',
  '/soundfonts/MusyngKite/tinkle_bell-mp3.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache all soundfonts in the background
      return cache.addAll(SOUNDFONTS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/soundfonts/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
