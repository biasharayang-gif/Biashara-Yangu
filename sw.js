// Biashara Yangu: lets the portal open without internet after the first visit.
var CACHE='by-portal-v1';
var SDK=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all([c.add('./index.html').catch(function(){}),c.add('./').catch(function(){})].concat(SDK.map(function(u){return c.add(new Request(u,{mode:'no-cors'})).catch(function(){})})))
  }).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(r.mode==='navigate'&&u.origin===location.origin){
    // newest page when online, saved page when offline
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put('./index.html',cp)});return res}).catch(function(){return caches.match('./index.html',{ignoreSearch:true}).then(function(m){return m||caches.match('./',{ignoreSearch:true})})}));return}
  if(SDK.indexOf(r.url)>=0){e.respondWith(caches.match(r.url).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r.url,cp)});return res})}))}
});
