const CACHE='galizische-bahn-v0.7.0-border1';
const ASSETS=['./','./index.html','./app.css','./app.js','./data.js','./store.js','./routing.js','./payment.js','./manifest.webmanifest','./version.json','./icons/favicon-32.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>{const network=fetch(e.request).then(r=>{if(r&&r.ok&&r.type!=='opaque')caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):cached);return cached||network}))});

self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
