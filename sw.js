// Tiene in cache i file del Quaderno di Krasimir così si apre anche senza rete.
// I dati passano sempre da Supabase e non vengono messi in cache qui.
const CACHE = 'krasimir-v1';
const FILES = ['./', 'index.html', 'config.js', 'supabase.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  // Cancella solo le versioni vecchie di questa app, non quella delle altre app.
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('krasimir-') && k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});

// Ogni obiettivo arriva come notifica a sé (tag diverso), con suono e vibrazione,
// e resta sullo schermo finché non la tocchi.
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Quaderno di Krasimir', {
    body: d.body || 'Hai delle cose da fare oggi.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'promemoria',
    renotify: true,
    silent: false,
    requireInteraction: true,
    vibrate: d.vibrate || [400, 150, 400, 150, 400],
    data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow(e.notification.data.url);
  }));
});
