// scripts/service-worker.js

const CACHE_NAME = 'tracking-tools-cache-v1';
// Daftar file penting yang akan disimpan di cache (membuat aplikasi lebih cepat)
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/checkman_dashboard.html',
  '/updator_dashboard.html',
  '/sparepart_stock.html',
  '/updator_sparepart.html',
  '/updator_detail.html',
  '/scripts/dashboard.js',
  '/scripts/updator.js',
  '/scripts/sparepart_stock.js',
  '/scripts/updator_sparepart.js',
  '/scripts/updator_detail.js'
  // Anda bisa menambahkan path ke ikon di sini jika mau
  // '/static/images/icon-192x192.png',
  // '/static/images/icon-512x512.png'
];

// Event saat Service Worker diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event saat aplikasi meminta file (fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Cek apakah file ada di cache
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, gunakan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari internet
        return fetch(event.request);
      })
  );
});