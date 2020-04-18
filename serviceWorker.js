//Setting
const version = "3.1";
const devlopement = false;

const cache_name = "Take a Break v" + version;
let file_to_cache = [
  ".",
  "index.html",
  "mainVue.js",
  "stylesheet.css",
  devlopement
    ? "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"
    : "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js",
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
  self.clients.claim();
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

self.addEventListener("message", function (event) {
  const { action, title, image, body } = event.data;
  if (action === "notification") {
    self.registration.showNotification(title, {
      image: image,
      body: body,
      actions: [{ action: "Got it", title: "Got it", icon: "" }],
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then((clients) => {
      for (client of clients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) clients.openWindow("/");
    })
  );
});
