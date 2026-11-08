const VERSION='0.9.3-major-refresh1';
const PREFIX='galizische-bahn-';
const CORE_CACHE=`${PREFIX}core-${VERSION}`;
const DATA_CACHE=`${PREFIX}data-${VERSION}`;
const RUNTIME_CACHE=`${PREFIX}runtime-${VERSION}`;

const CORE=[
  './','./index.html','./404.html',
  './app.css?v=0.9.3-major-refresh1','./app.js?v=0.9.3-major-refresh1','./i18n.js?v=0.9.3-major-refresh1',
  './core.js?v=0.9.3-major-refresh1','./selectors.js?v=0.9.3-major-refresh1','./persistence.js?v=0.9.3-major-refresh1',
  './store.js?v=0.9.3-major-refresh1','./payment.js?v=0.9.3-major-refresh1','./auth.js?v=0.9.3-major-refresh1','./live.js?v=0.9.3-major-refresh1',
  './manifest.webmanifest','./version.json',
  './icons/favicon-32.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-icon-512.png','./icons/gb-logo.svg'
];
const DATA=[
  './data.js?v=0.9.3-major-refresh1','./rail-services.js?v=0.9.3-major-refresh1','./routing.js?v=0.9.3-major-refresh1'
];

self.addEventListener('install',event=>{
  event.waitUntil(Promise.all([
    caches.open(CORE_CACHE).then(cache=>cache.addAll(CORE)),
    caches.open(DATA_CACHE).then(cache=>cache.addAll(DATA))
  ]).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(key=>key.startsWith(PREFIX)&&![CORE_CACHE,DATA_CACHE,RUNTIME_CACHE].includes(key)).map(key=>caches.delete(key))
  )).then(()=>self.clients.claim()));
});

async function networkFirst(request,fallback='./index.html'){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok){const cache=await caches.open(CORE_CACHE);cache.put(fallback,response.clone())}
    return response;
  }catch{
    return (await caches.match(fallback))||(await caches.match(request));
  }
}

async function staleWhileRevalidate(request,cacheName){
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request);
  const update=fetch(request).then(response=>{
    if(response?.ok&&response.type!=='opaque')cache.put(request,response.clone());
    return response;
  }).catch(()=>null);
  return cached||update||new Response('',{status:503,statusText:'Offline'});
}

async function cacheFirst(request){
  const cached=await caches.match(request);if(cached)return cached;
  try{
    const response=await fetch(request);
    if(response?.ok&&response.type!=='opaque'){const cache=await caches.open(RUNTIME_CACHE);cache.put(request,response.clone())}
    return response;
  }catch{return new Response('',{status:503,statusText:'Offline'})}
}

self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(networkFirst(request));return}
  if(url.pathname.endsWith('/sw.js')||url.pathname.endsWith('/version.json')){event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request)));return}
  if(/\.(?:png|svg|jpg|jpeg|webp|ico)$/i.test(url.pathname)){event.respondWith(cacheFirst(request));return}
  if(url.pathname.endsWith('/data.js')||url.pathname.endsWith('/rail-services.js')||url.pathname.endsWith('/routing.js')){event.respondWith(staleWhileRevalidate(request,DATA_CACHE));return}
  if(/\.(?:js|css|webmanifest)$/i.test(url.pathname)){event.respondWith(staleWhileRevalidate(request,CORE_CACHE));return}
  event.respondWith(cacheFirst(request));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='GET_VERSION')event.source?.postMessage?.({type:'GB_VERSION',version:VERSION});
});
