const CACHE='galizische-bahn-v0.7.1-quality1';
const ASSETS=['./','./index.html','./app.css?v=0.7.1','./app.js?v=0.7.1','./data.js','./store.js','./routing.js','./payment.js','./manifest.webmanifest','./version.json','./icons/favicon-32.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.pathname.endsWith('/sw.js')||url.pathname.endsWith('/version.json')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response&&response.ok&&response.type!=='opaque')caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./index.html'):undefined))));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
