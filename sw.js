// Service worker: guarda la app para que funcione sin conexión.
// Si publicás una versión nueva de index.html, subí el número de VERSION.
const VERSION='acordero-v1.6';
const ARCHIVOS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Responde desde lo guardado y se actualiza en segundo plano para la próxima vez.
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(VERSION).then(async c=>{
    const guardado=await c.match(r,{ignoreSearch:true});
    const red=fetch(r).then(n=>{if(n&&n.ok)c.put(r,n.clone());return n}).catch(()=>guardado);
    return guardado||red;
  }));
});
