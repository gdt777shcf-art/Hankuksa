// 한국사 암기장 — 오프라인 캐시. 저장된 파일을 먼저 보여 주고, 뒤에서 새 버전을 받아 다음 실행 때 반영한다.
const V='hk-cache-2';
const CORE=['./','index.html','data.js','topics.js','bank.js','sums.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  const own=u.origin===location.origin,font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!own&&!font)return;
  e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r,{ignoreSearch:own});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res});
    if(hit){e.waitUntil(net.catch(()=>{}));return hit}
    return net.catch(()=>own&&r.mode==='navigate'?c.match('index.html'):Response.error())}))});
