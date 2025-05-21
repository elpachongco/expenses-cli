const CACHE_NAME = "expenses-cache-v4";
const URLS_TO_CACHE = [
  // Local files
  "earlps.net/expenses-cli/",
  "earlps.net/expenses-cli/index.html",
  "earlps.net/expenses-cli/manifest.json",
  "earlps.net/expenses-cli/pico-theme.css",
  "earlps.net/expenses-cli/favicon-96x96.png",
  "earlps.net/expenses-cli/favicon.svg",
  "earlps.net/expenses-cli/favicon.ico",
  "earlps.net/expenses-cli/apple-touch-icon.png",
  "earlps.net/expenses-cli/site.webmanifest",
  "earlps.net/expenses-cli/web-app-manifest-192x192.png",
  "earlps.net/expenses-cli/web-app-manifest-512x512.png",
  "earlps.net/expenses-cli/PapaParse-5.0.2/papaparse.js",

  // Remote assets (CDN-hosted)
  "https://unpkg.com/vue@3/dist/vue.global.js",
  "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css",
  // "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  // "https://fonts.googleapis.com",
  // "https://fonts.gstatic.com"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }).catch((err) => {
      console.error("Failed to cache:", err);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

