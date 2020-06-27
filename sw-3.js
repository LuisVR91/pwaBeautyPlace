/* Agega cosas definidas al cahcem,  al iniciar la web y captura todasa las paginas que se visitan, 
En offline manda a una pagia de "offline.htm" si la pagina no esta en cache */
//This is the service worker with the Advanced caching

const CACHE = "pwabuilder-adv-cache";
const precacheFiles = [
  /* Add an array of files to precache for your app */
  'offline.html',
  'https://statics.memondo.com/p/s1/crs/2019/08/CR_1110839_ebd6fb086a584c3b8f9eb0b8cec946d9_que_cuanto_tiempo_llevo_sin_internet_thumb_fb.jpg?cb=5364986'
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

const networkFirstPaths = [
 'https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$'
];

const avoidCachingPaths = [
  /* Add an array of regex of paths that shouldn't be cached */
  // Example: /\/api\/.*/
];

function pathComparer(requestUrl, pathRegEx) {
  return requestUrl.match(new RegExp(pathRegEx));
}

function comparePaths(requestUrl, pathsArray) {
  if (requestUrl) {
    for (let index = 0; index < pathsArray.length; index++) {
      const pathRegEx = pathsArray[index];
      if (pathComparer(requestUrl, pathRegEx)) {
        return true;
      }
    }
  }

  return false;
}

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");

      return cache.addAll(precacheFiles).then(function () {
        return cache.add(offlineFallbackPage);
      });
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  if (comparePaths(event.request.url, networkFirstPaths)) {
    networkFirstFetch(event);
  } else {
    cacheFirstFetch(event);
  }
});

function cacheFirstFetch(event) {
  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            // The following validates that the request was for a navigation to a new document
            if (event.request.destination !== "document" || event.request.mode !== "navigate") {
              return;
            }

            console.log("[PWA Builder] Network request failed and no cache." + error);
            // Use the precached offline page as fallback
            return caches.open(CACHE).then(function (cache) {
              cache.match(offlineFallbackPage);
            });
          });
      }
    )
  );
}

function networkFirstFetch(event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
}

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return the offline page
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        if (!matching || matching.status === 404) {
          // The following validates that the request was for a navigation to a new document
          if (request.destination !== "document" || request.mode !== "navigate") {
            return Promise.reject("no-match");
          }
  
          return cache.match(offlineFallbackPage);
        }
  
        return matching;
      });
    });
  }

function updateCache(request, response) {
  if (!comparePaths(request.url, avoidCachingPaths)) {
    return caches.open(CACHE).then(function (cache) {
      return cache.put(request, response);
    });
  }

  return Promise.resolve();
}


// ultimos


// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
    const offlinePageRequest = new Request(offlineFallbackPage);
  
    return fetch(offlineFallbackPage).then(function (response) {
      return caches.open(CACHE).then(function (cache) {
        console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
        return cache.put(offlinePageRequest, response);
      });
    });
  });
  