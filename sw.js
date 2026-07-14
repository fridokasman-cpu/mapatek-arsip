// ================================================================
// FILE: sw.js
// DESKRIPSI: Service Worker untuk caching tile peta offline
// LOKASI: Root folder (selevel dengan peta-pendakian.html)
// ================================================================

const CACHE_NAME = 'mapatek-map-v3';
const TILES_CACHE = 'mapatek-tiles-v3';

// Daftar tile provider yang akan di-cache (domain)
const TILE_DOMAINS = [
    'tile.openstreetmap.org',
    'tile.opentopomap.org',
    'server.arcgisonline.com'
];

// Aset lokal yang akan di-cache saat install
const LOCAL_ASSETS = [
    './peta-pendakian.html',
    './css/peta.css',
    './js/peta.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css',
    'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/2.0.0/Control.FullScreen.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.fullscreen/2.0.0/Control.FullScreen.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet-compass/1.2.4/leaflet.compass.min.js'
];

// ================================================================
// INSTALL
// ================================================================
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Service Worker: Meng-cache aset lokal');
                return cache.addAll(LOCAL_ASSETS);
            })
            .then(function() {
                console.log('✅ Service Worker: Instalasi selesai');
                self.skipWaiting();
            })
            .catch(function(error) {
                console.error('❌ Service Worker: Gagal meng-cache aset', error);
            })
    );
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
                        console.log('🗑️ Service Worker: Hapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(function() {
            console.log('✅ Service Worker: Aktivasi selesai, claim clients');
            return self.clients.claim();
        })
    );
});

// ================================================================
// FETCH
// ================================================================
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);

    // ============================================================
    // 1. CACHE TILE PETA
    // ============================================================
    // Cek apakah request berasal dari domain tile provider
    const isTileRequest = TILE_DOMAINS.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
    if (isTileRequest) {
        event.respondWith(
            caches.open(TILES_CACHE).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    if (response) {
                        // Jika ada di cache, kembalikan
                        console.log('📦 Tile dari cache:', url.pathname);
                        return response;
                    }
                    // Jika tidak, ambil dari jaringan dan simpan ke cache
                    return fetch(event.request).then(function(networkResponse) {
                        if (networkResponse && networkResponse.status === 200) {
                            // Clone response karena kita akan menyimpannya
                            const clonedResponse = networkResponse.clone();
                            cache.put(event.request, clonedResponse);
                            console.log('💾 Tile disimpan ke cache:', url.pathname);
                        }
                        return networkResponse;
                    }).catch(function() {
                        // Jika offline dan tidak ada cache, mungkin return placeholder
                        console.warn('⚠️ Tile tidak tersedia offline:', url.pathname);
                        return new Response('', { status: 503, statusText: 'Service Unavailable' });
                    });
                });
            })
        );
        return;
    }

    // ============================================================
    // 2. CACHE ASET LOKAL (HTML, CSS, JS)
    // ============================================================
    // Cek apakah request untuk aset lokal (berdasarkan path)
    const isLocalAsset = event.request.url.includes('/mapatek-arsip/') ||
                         event.request.url.includes('/peta-pendakian') ||
                         event.request.url.includes('/css/peta.css') ||
                         event.request.url.includes('/js/peta.js');

    if (isLocalAsset) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    console.log('📦 Aset lokal dari cache:', url.pathname);
                    return response;
                }
                return fetch(event.request).then(function(networkResponse) {
                    // Simpan ke cache untuk digunakan nanti
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                }).catch(function() {
                    // Fallback offline
                    console.warn('⚠️ Offline - tidak dapat memuat:', url.pathname);
                    return new Response('Offline - MAPATEK', { status: 503 });
                });
            })
        );
        return;
    }

    // ============================================================
    // 3. UNTUK REQUEST LAIN (CDN, API, dll) - default fetch dengan cache
    // ============================================================
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch(function() {
            // Jika semua gagal, beri respons offline minimal
            return new Response('Offline', { status: 503 });
        })
    );
});