const CACHE_VERSION = "v11";
const CACHE_NAME = `fm-portfolio-${CACHE_VERSION}`;
const BASE = "./";

const ASSETS = [
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}offline.html`,
];

// INSTALL – pre-cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE – clean up old caches + notify clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );

      // Claim clients immediately
      await self.clients.claim();

      // 🔔 Broadcast message to all open tabs
      const clientsList = await self.clients.matchAll({ type: "window" });
      clientsList.forEach((client) =>
        client.postMessage({ type: "NEW_VERSION", version: CACHE_VERSION })
      );
    })()
  );
});

// FETCH – stale-while-revalidate
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);

      try {
        const networkResponse = await fetch(event.request);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.destination === "image" ||
            event.request.destination === "script" ||
            event.request.destination === "style" ||
            event.request.destination === "document" ||
            event.request.destination === "font" ||
            event.request.url.includes(".ico") ||
            event.request.url.includes(".png") ||
            event.request.url.includes(".jpg") ||
            event.request.url.includes(".jpeg") ||
            event.request.url.includes(".svg") ||
            event.request.url.includes(".webp"))
        ) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        if (cached) return cached;
        if (event.request.destination === "document") {
          return cache.match(`${BASE}offline.html`);
        }
      }
    })()
  );
});
