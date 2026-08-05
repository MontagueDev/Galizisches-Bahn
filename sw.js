const CACHE='galizische-bahn-v0.8.2-ui-refinement2';
const CORE=[
  './','./index.html','./app.css?v=0.8.2-ui2','./app.js?v=0.8.2-ui2','./i18n.js?v=0.8.2-ui2',
  './data.js?v=0.8.2-ui2','./store.js?v=0.8.2-ui2','./routing.js?v=0.8.2-ui2','./payment.js?v=0.8.2-ui2','./manifest.webmanifest','./version.json',
  './icons/favicon-32.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-icon-512.png'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.endsWith('/sw.js')||url.pathname.endsWith('/version.json')||url.pathname.endsWith('/index.html')||event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request.mode==='navigate'?'./index.html':event.request,response.clone()));
      return response;
    }).catch(()=>caches.match(event.request.mode==='navigate'?'./index.html':event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response&&response.ok&&response.type!=='opaque')caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));
    return response;
  })));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
