// No app-shell caching: always use the network for current application code.
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('gmt400-')).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

// No fetch handler: requests use the browser's normal network behavior.
