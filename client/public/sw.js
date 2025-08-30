const VERSION = 'v2';
const ASSET_CACHE = 'keystone-assets-' + VERSION;
const PAGE_CACHE = 'keystone-pages-' + VERSION;
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(ASSET_CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.map(k=>{
      if (!k.includes(VERSION)) return caches.delete(k);
    })))
  );
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // ignore cross-origin

  // HTML documents: network-first with offline fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(resp=>{
        const copy = resp.clone();
        caches.open(PAGE_CACHE).then(c=> c.put(e.request, copy));
        return resp;
      }).catch(()=> caches.match('/index.html'))
    );
    return;
  }
  // Static assets: cache-first
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open(ASSET_CACHE).then(c=> c.put(e.request, copy));
      return resp;
    }))
  );
});
