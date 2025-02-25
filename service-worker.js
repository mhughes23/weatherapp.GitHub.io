const CACHE_NAME = `Michai's Weather App-v1`;
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching app resources...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`Deleting old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ensures the service worker takes control of clients immediately
});

// Fetch Requests and Serve Cached Files
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.warn("Offline and resource not cached:", event.request.url);
                return caches.match("/index.html"); // Fallback to home page if offline
            });
        })
    );
});

// Register Service Worker in main script
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
            console.log("Service Worker registration failed:", error);
        });
}
