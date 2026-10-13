/* Service worker de Rackman Inventario.
   Siempre intenta traer la versión nueva de internet; la copia guardada solo se usa si no hay conexión.
   No toca Firebase ni Google: los datos del stock nunca se guardan acá. */
const CACHE = 'rackman-v1';
const BASICOS = ['index.html', 'almacen.html', 'admin-inventario.html', 'manifest-inventario.webmanifest', 'manifest-admin.webmanifest',
  'Iconos/inventario-192.png', 'Iconos/inventario-512.png', 'Iconos/admin-192.png', 'Iconos/admin-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
