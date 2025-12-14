const CACHE_VERSION = 'v1.0.1'; // 👈 Change cette version à chaque déploiement
const CACHE_NAME = `memo-table-cache-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // 👈 Active immédiatement le nouveau SW
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          urlsToCache.map(url =>
            fetch(url)
              .then(response => {
                if (!response.ok) {
                  console.warn(`Impossible de mettre en cache ${url}`);
                  return;
                }
                return cache.put(url, response);
              })
              .catch(() => {
                console.warn(`Erreur lors de la récupération de ${url}`);
              })
          )
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim()) // 👈 Prend le contrôle immédiatement
  );
});

// 👈 Écoute les messages du client
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});