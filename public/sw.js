/* GMT400 — lekki service worker (bez bibliotek).
 * - powłoka aplikacji + strona /offline w cache przy instalacji,
 * - strony: najpierw sieć, bez sieci kopia z cache albo /offline,
 * - odwiedzone poradniki DIY / usterki (/baza/…) oraz zapisane przyciskiem „Zapisz offline” działają bez sieci,
 * - NIGDY nie cache'ujemy panelu admina ani próśb Historia VIN (/admin, /api/vin-requests, /api/admin).
 */
const VERSION = 'v1';
const SHELL = `gmt400-shell-${VERSION}`;
const PAGES = `gmt400-pages-${VERSION}`;
const ASSETS = `gmt400-assets-${VERSION}`;
const SAVED = 'gmt400-saved'; // „Zapisz offline” — bez wersji, żeby zapisane strony przetrwały aktualizację
const SHELL_URLS = ['/', '/offline', '/diy', '/usterki', '/szukaj', '/manifest.json', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];
const MAX_PAGES = 60;
const MAX_ASSETS = 250;

const NEVER = [/^\/admin(\/|$)/, /^\/api\/vin-requests(\/|$)/, /^\/api\/admin(\/|$)/];
const never = url => NEVER.some(re => re.test(url.pathname));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // Pojedynczo: jeden błąd (np. chwilowy 500) nie blokuje instalacji.
    await Promise.all(SHELL_URLS.map(u => cache.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL, PAGES, ASSETS, SAVED]);
    for (const key of await caches.keys()) if (key.startsWith('gmt400-') && !keep.has(key)) await caches.delete(key);
    await self.clients.claim();
  })());
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

async function put(cacheName, request, response, max) {
  if (!response || !response.ok || response.type === 'opaque') return;
  const cc = response.headers.get('Cache-Control') || '';
  if (/no-store|private/i.test(cc)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  if (max) trim(cacheName, max);
}

const pageKey = url => new Request(url.origin + url.pathname + url.search);

async function handleNavigation(event, url) {
  try {
    const response = await fetch(event.request);
    event.waitUntil(put(PAGES, pageKey(url), response.clone(), MAX_PAGES));
    return response;
  } catch {
    const cached = (await caches.match(pageKey(url), { ignoreVary: true })) || (await caches.match(url.origin + url.pathname, { ignoreSearch: true, ignoreVary: true }));
    if (cached) return cached;
    return (await caches.match('/offline')) || new Response('<h1>Brak połączenia</h1>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || never(url)) return;
  // Dane RSC (nawigacja po stronie klienta) zostawiamy Next.js — bez sieci Next przełącza się na pełne przeładowanie, które obsługujemy niżej.
  if (request.headers.get('RSC') || url.searchParams.has('_rsc')) return;

  if (request.mode === 'navigate') { event.respondWith(handleNavigation(event, url)); return; }

  // Statyczne pliki Next.js mają hash w nazwie — cache-first.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(res => { event.waitUntil(put(ASSETS, request, res.clone(), MAX_ASSETS)); return res; })));
    return;
  }
  // Dane encyklopedii (lista wpisów do wyszukiwarki i list DIY/usterek) i obrazy: sieć, bez sieci kopia.
  if (url.pathname === '/api/notion' || url.pathname.startsWith('/_next/image') || /\.(?:webp|png|jpe?g|svg|avif|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(fetch(request).then(res => { event.waitUntil(put(ASSETS, request, res.clone(), MAX_ASSETS)); return res; }).catch(async () => (await caches.match(request, { ignoreVary: true })) || Response.error()));
  }
});
