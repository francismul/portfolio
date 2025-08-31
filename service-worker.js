self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("fm-portfolio-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/css/styles.css",
        "/assets/js/script.js",
        "/manifest.json",
        "/assets/images/icon-192.png",
        "/assets/images/icon-512.png",
        "/assets/images/favicon.ico",
        "/offline.html",
      ]);
    })
  );
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("fm-portfolio-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/css/styles.css",
        "/assets/js/script.js",
        "/manifest.json",
        "/assets/images/icon-192.png",
        "/assets/images/icon-512.png",
        "/assets/images/favicon.ico",
        "/offline.html",
      ]).then(() => self.skipWaiting());
    })
  );
});
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== "fm-portfolio-v1")
          .map((key) => caches.delete(key))
      );
    })
  );
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== "fm-portfolio-v1")
          .map((key) => caches.delete(key))
      ).then(() => self.clients.claim());
    })
  );
});
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  event.respondWith(
    (async () => {
      const assetCache = await caches.open("fm-portfolio-v1");
      const metaCache = await caches.open("sw-metadata");
      const cachedResponse = await assetCache.match(event.request);
      const metaKey = new Request(event.request.url + "?sw-metadata");
      const metaResponse = await metaCache.match(metaKey);
      const now = Date.now();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
      let lastAccess = 0;
      if (metaResponse) {
        lastAccess = parseInt(await metaResponse.text(), 10);
      }
      if (cachedResponse && (!lastAccess || now - lastAccess <= maxAge)) {
        // Cache is valid, update last access time
        await metaCache.put(metaKey, new Response(now.toString()));
        return cachedResponse;
      }
      try {
        const networkResponse = await fetch(event.request);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.destination === "image" ||
            event.request.destination === "script" ||
            event.request.destination === "style" ||
            event.request.url.includes("favicon.ico") ||
            (event.request.destination === "" &&
              event.request.headers.get("accept") &&
              event.request.headers.get("accept").includes("application/json")))
        ) {
          assetCache.put(event.request, networkResponse.clone());
          await metaCache.put(metaKey, new Response(now.toString()));
        }
        return networkResponse;
      } catch (err) {
        if (event.request.destination === "image") {
          return assetCache.match("/assets/images/icon-192.png");
        }
        if (event.request.destination === "document") {
          return assetCache.match("/offline.html");
        }
      }
    })()
  );
});
