const version = "1";
const cache_name = "Take a Break v" + version;
let file_to_cache = [
  ".",
  "index.html",
  "stylesheet.css",
  "https://cdn.jsdelivr.net/npm/vue/dist/vue.js",
  "helpText.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cache_name).then((cache) => cache.addAll(file_to_cache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cache_name) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
