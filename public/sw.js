const CACHE_NAME = 'memo-table-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512',
  // Ajoute ici les autres fichiers que tu veux mettre en cache (JS, CSS, etc.)
];

self.addEventListener('install', (event) => {
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

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request);
        })
    );
});