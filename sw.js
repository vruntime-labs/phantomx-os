const CACHE_NAME = 'phantomx-v2.3.0';
const ASSETS = ['./','./index.html','./style.css','./kernel.js','./script.js','./manifest.json','./privacy/','./terms/','./cookies/','./disclaimer/','./acceptable-use/','./copyright/','./license/','./security/','./legal/','./contributors/','./data/contributors.json','./assets/css/legal.css','./.well-known/security.txt'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('phantomx-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
