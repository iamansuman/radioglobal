const cacheName = "radioglobal_cache_v1";
const cachedAssets = ["index.html", "crs-pf/stations.json", "img/radio.png", "img/radiox192.png", "svg/search.svg", "svg/play.svg", "svg/pause.svg", "svg/fav.svg", "svg/notfav.svg", "svg/pre.svg", "svg/next.svg", 'css/style.css', 'css/resp.css', 'js/script.js', 'js/radio.js', 'https://unpkg.com/localbase@0.7.5/dist/localbase.min.js'];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => { cache.addAll(cachedAssets) })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== cacheName) {
              return caches.delete(cache);
             }
          })
        );
     })
   );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request))
    );
});