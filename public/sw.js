const CACHE_NAME = "studyflow-v1";
const APP_SHELL = ["/StudyFlow/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
