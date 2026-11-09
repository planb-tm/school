const BUILD_ID = '__PLANB_BUILD_ID__';
const BASE_URL = __PLANB_BASE_URL__;
const PRECACHED_ASSETS = __PLANB_PRECACHED_ASSETS__;
const APP_SCOPE = new URL(BASE_URL, self.location.origin).href;
const SHELL_CACHE = `planb-school-shell-${BUILD_ID}`;
const RUNTIME_CACHE = 'planb-school-runtime-v1';
const LEGACY_CACHE_NAMES = ['planb-shell-v1', 'planb-shell-v2', 'planb-shell-v3'];
const MANAGED_CACHE_PREFIXES = ['planb-school-shell-', 'planb-school-runtime-'];
const VERSION_REQUEST_TIMEOUT_MS = 1200;
const clientBuilds = new Map();

function isAppRequest(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && url.href.startsWith(APP_SCOPE);
}

async function matchAppClients() {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  return clients.filter((client) => client.url.startsWith(APP_SCOPE));
}

function isHashedBuildAsset(url) {
  return url.pathname.startsWith(new URL('assets/', APP_SCOPE).pathname)
    && /-[\w-]{8,}\.(?:js|css|woff2?|svg|png|jpe?g|webp)$/.test(url.pathname);
}

function isHtmlResponse(response) {
  return response.headers.get('content-type')?.includes('text/html') ?? false;
}

async function cacheResponse(cacheName, request, response) {
  if (!response || response.type === 'error' || response.status === 206) return;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch {
    // A full cache must not prevent the network response from reaching the app.
  }
}

async function networkFirst(request, fallbackRequests = []) {
  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';

  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (isAppRequest(request)) {
      if (isNavigation && isHtmlResponse(response)) {
        await cacheResponse(SHELL_CACHE, request, response);
      } else if (response.ok) {
        await cacheResponse(RUNTIME_CACHE, request, response);
      }
    }
    return response;
  } catch {
    const runtime = await caches.open(RUNTIME_CACHE);
    const shell = await caches.open(SHELL_CACHE);
    const cached = await runtime.match(request)
      ?? await shell.match(request)
      ?? (await Promise.all(fallbackRequests.map(async (fallback) =>
        await runtime.match(fallback) ?? await shell.match(fallback),
      ))).find(Boolean);

    if (cached) return cached;
    if (isNavigation) {
      const appIndex = new URL('index.html', APP_SCOPE).href;
      const fallback = await shell.match(appIndex);
      if (fallback) return fallback;
    }
    throw new Error(`Offline and no cached response for ${url.pathname}`);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) await cacheResponse(SHELL_CACHE, request, response);
  return response;
}

async function migrateLegacyRuntimeEntries() {
  const runtime = await caches.open(RUNTIME_CACHE);
  for (const name of LEGACY_CACHE_NAMES) {
    const legacy = await caches.open(name);
    for (const request of await legacy.keys()) {
      if (!isAppRequest(request)) continue;
      const url = new URL(request.url);
      if (request.mode === 'navigate' || url.pathname.endsWith('.html')
        || url.pathname.startsWith(new URL('assets/', APP_SCOPE).pathname)) continue;
      const response = await legacy.match(request);
      if (response) await cacheResponse(RUNTIME_CACHE, request, response);
    }
  }
}

async function requestClientVersions() {
  const clients = await matchAppClients();
  for (const client of clients) {
    client.postMessage({ type: 'PLANB_VERSION_REQUEST', buildId: BUILD_ID });
  }

  await new Promise((resolve) => setTimeout(resolve, VERSION_REQUEST_TIMEOUT_MS));
}

async function cleanOldAppCachesIfSafe() {
  const clients = await matchAppClients();
  const openClientIds = new Set(clients.map((client) => client.id));
  for (const clientId of clientBuilds.keys()) {
    if (!openClientIds.has(clientId)) clientBuilds.delete(clientId);
  }
  const allClientsUseCurrentBuild = clients.every((client) =>
    clientBuilds.get(client.id) === BUILD_ID,
  );
  if (!allClientsUseCurrentBuild) return;

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames
    .filter((name) => MANAGED_CACHE_PREFIXES.some((prefix) => name.startsWith(prefix))
      || LEGACY_CACHE_NAMES.includes(name))
    .filter((name) => name !== SHELL_CACHE && name !== RUNTIME_CACHE)
    .map((name) => caches.delete(name)));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const shellUrls = [
      APP_SCOPE,
      new URL('index.html', APP_SCOPE).href,
      new URL('manifest.webmanifest', APP_SCOPE).href,
      new URL('favicon.svg', APP_SCOPE).href,
      new URL('icons/icon-192.png', APP_SCOPE).href,
      new URL('icons/icon-512.png', APP_SCOPE).href,
      new URL('apple-touch-icon.png', APP_SCOPE).href,
      ...PRECACHED_ASSETS.map((path) => new URL(path, self.location.origin).href),
    ];

    for (const url of new Set(shellUrls)) {
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok) throw new Error(`Failed to precache ${url}: ${response.status}`);
      await cache.put(url, response);
    }

    const openClients = await matchAppClients();
    for (const client of openClients) {
      client.postMessage({ type: 'PLANB_UPDATE_READY', buildId: BUILD_ID });
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await migrateLegacyRuntimeEntries();
    const openClients = await matchAppClients();
    for (const client of openClients) {
      client.postMessage({ type: 'PLANB_VERSION_ACTIVATED', buildId: BUILD_ID });
    }
    await requestClientVersions();
    await cleanOldAppCachesIfSafe();
  })());
});

self.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || typeof message !== 'object') return;

  if (message.type === 'PLANB_SKIP_WAITING') {
    self.skipWaiting();
  } else if (message.type === 'PLANB_GET_VERSION' && event.source && 'postMessage' in event.source) {
    event.source.postMessage({ type: 'PLANB_WORKER_VERSION', buildId: BUILD_ID });
  } else if (message.type === 'PLANB_CLIENT_VERSION'
    && typeof message.buildId === 'string'
    && event.source && 'id' in event.source) {
    clientBuilds.set(event.source.id, message.buildId);
    event.waitUntil(cleanOldAppCachesIfSafe());
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !isAppRequest(request)) return;

  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isHashedBuildAsset(url)) {
    event.respondWith(cacheFirst(request).catch(() => networkFirst(request)));
    return;
  }

  event.respondWith(networkFirst(request));
});
