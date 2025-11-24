const CACHE_NAME = 'lol-tactician-v1';

// Install event: Cache files if needed, though for this dynamic dev environment we largely rely on network
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event: Network first strategy to ensure fresh data for the AI/API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});