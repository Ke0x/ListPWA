const CACHE_NAME = "offline";
const OFFLINE_URL = "offline.html";

const respondWithFetchPromiseNavigate = (event) =>
  new Promise((resolve) => {
    event.preloadResponse
      .then((preloadResponse) => {
        if (preloadResponse) {
          resolve(preloadResponse);
        }

        fetch(event.request)
          .then((networkResponse) => {
            resolve(networkResponse);
          })
          .catch(() => {
            alert("offline");
            caches.open(CACHE_NAME).then((cache) => {
              cache.match(OFFLINE_URL).then((cachedResponse) => {
                resolve(cachedResponse);
              });
            });
          });
      })
      .catch(() => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.match(OFFLINE_URL).then((cachedResponse) => {
            resolve(cachedResponse);
          });
        });
      });
  });

const fetchSW = (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(respondWithFetchPromiseNavigate(event));
  }
};

const waitUntilActivatePromise = () =>
  new Promise((resolve) => {
    if ("navigationPreload" in self.registration) {
      self.registration.navigationPreload.enable().finally(resolve);
    }
  });

const activate = (event) => {
  event.waitUntil(waitUntilActivatePromise());
  self.clients.claim();
};

const waitUntilInstallationPromise = () =>
  new Promise((resolve) => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.add(new Request(OFFLINE_URL, { cache: "reload" })).then(resolve);
    });
  });

const installSW = (event) => {
  event.waitUntil(waitUntilInstallationPromise());
  self.skipWaiting();
};

self.addEventListener("install", installSW);
self.addEventListener("activate", activate);
self.addEventListener("fetch", fetchSW);
