/*
 */
'use strict';

// : Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v4';
const DATA_CACHE_NAME = 'data-cache-v2';

// : Add list of files to cache here.
const FILES_TO_CACHE = [
  // Se non abbiamo cache .. '/offline.html'
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/styles/inline.css',
  '/images/install.svg',
  '/images/favicon.ico',
  '/images/icons/icon-32x32.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-256x256.png',
  '/images/icons/icon-512x512.png',
  ];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  // : Precache static resources here.
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

  // : Remove previous cached data from disk.
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

  // : Add fetch event handler here.
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
