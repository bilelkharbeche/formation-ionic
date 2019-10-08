importScripts("https://cdn.rawgit.com/mozilla/localForage/master/dist/localforage.js");

self.addEventListener('install', event => {
    console.log('Installation du Service Worker...');
    console.log('Mise en cache des ressources');
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            }),
              fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
                  .then(resp => resp.json())
                  .then(speakers => {
                      localforage.config({storeName: 'speakers'})
                      for (key in speakers) {
                          localforage.setItem(key, speakers[key])
                      }
                  })]
            )
    );
});

self.skipWaiting();

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
  });

  const FILES_TO_CACHE = [
    '/',
    'app.css',
    'app.js'
];

const STATIC_CACHE_NAME = 'pages-cache-v2';

self.addEventListener('install', event => {
    console.log('Installation du Service Worker...');
    console.log('Mise en cache des ressources');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log(event.request.url, 'servi depuis le cache');
                return response;
            }
            console.log(event.request.url, 'servi depuis le réseau');
            return fetch(event.request)

        })
        .then(function (response) {

            return caches.open(STATIC_CACHE_NAME).then(cache => {

                // mise en cache des ressources qui ne contiennent pas no.cache
                if (event.request.url.indexOf('no.cache') < 0) {
                    cache.put(event.request.url, response.clone());
                }
                return response;
            });
        })
        .catch(error => {
            console.log("oops");
        })
    );
});