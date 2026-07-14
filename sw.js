// ================================================================
// FILE: sw.js
// DESKRIPSI: Service Worker untuk caching tile peta offline
// LOKASI: Root folder (selevel dengan peta-pendakian.html)
// ================================================================

const CACHE_NAME = 'mapatek-map-v2';
const TILES_CACHE = 'mapatek-tiles-v2';

const TILE_URLS = [
    'https://tile.openstreetmap.org',
    'https://tile.opentopomap.org',
    'https://server.arcgisonline.com'
];

// ================================================================
// INSTALL
// ================================================================
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('📦 Cache dibuka');
            return cache.addAll([
                '/peta-pendakian.html',
                '/css/peta.css',
                '/js/peta.js',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            ]);
        })
    );
    self.skipWaiting();
});

// ================================================================
// ACTIVATE
// ================================================================
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName !== TILES_CACHE) {
                        console.log('🗑️ Hapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// ================================================================
// FETCH
// ================================================================
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);

    // Cache tile peta
    if (TILE_URLS.some(t => url.origin === t || url.href.includes(t))) {
        event.respondWith(
            caches.open(TILES_CACHE).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    if (response) {
                        console.log('📦 Dari cache:', url.pathname);
                        return response;
                    }
                    return fetch(event.request).then(function(networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(function() {
                    return fetch(event.request);
                });
            })
        );
        return;
    }

    // Cache HTML, CSS, JS
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch(function() {
            return new Response('Offline - MAPATEK', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        })
    );
});