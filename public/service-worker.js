/*
 */
'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v2';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  // Se non abbiamo cache .. '/offline.html'
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/styles/inline.css',
  '/images/install.svg'
  ];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch ', evt.request.url);
  console.log('[ServiceWorker] Mode ', evt.request.mode);

  // CODELAB: Add fetch event handler here.
  /* Original code
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('offline.html');
                });
          })
  ); */
  
  //SM Nuova gestione con il recupero dei dati in cache
  // if (evt.request.url.includes('/forecast/')) 
  if (evt.request.url.includes('openweathermap')) 
  {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                // If the response was good, clone it and store it in the cache.
                console.log(response.status)
                if (response.status === 200) {
                  console.log(".. add to cache")
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              }).catch((err) => {
                // Network request failed, try to get it from the cache.
                console.log(".. network failed, get from cache ..")
                return cache.match(evt.request);
              });
        }));
    return;
  }
  evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request)
            .then((response) => {
              console.log("caches open match")
              return response || fetch(evt.request);
            });
      })
  );
});
