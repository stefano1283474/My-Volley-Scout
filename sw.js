// Service Worker per My Volley Scout PWA
const CACHE_NAME = 'my-volley-scout-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/auth.html',
  '/login.html',
  '/styles.css',
  '/auth.css',
  '/app.js',
  '/auth.js',
  '/firebase-config.js',
  '/firestore-service.js',
  '/connection-manager.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Cache vecchia rimossa:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercettazione richieste
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - restituisci risposta
        if (response) {
          return response;
        }
        
        // Clone richiesta
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se riceviamo una risposta valida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone risposta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Gestione messaggi per sincronizzazione offline
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});