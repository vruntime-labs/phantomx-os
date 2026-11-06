const CACHE_NAME = 'phantomx-v2.3.1';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './kernel.js',
  './script.js',
  './manifest.json',
  './assets/phantomx-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('phantomx-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        return (await cache.match(request)) ||
          (await cache.match('./index.html')) ||
          Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
      event.waitUntil(fetch(request).then((response) => {
        if (response && response.ok) return cache.put(request, response.clone());
      }).catch(() => undefined));
      return cached;
    }
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
