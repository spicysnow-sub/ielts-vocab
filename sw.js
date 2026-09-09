/* sw.js — 語彙オフライン版のキャッシュ番人
   中身は index.html 1枚（フォントも語彙データも中に入っている）なので、
   ここで守るのは実質そのファイルだけ。2026-09-09-f68c789f はビルドが差し込む。 */
var VER = "2026-09-09-f68c789f";
var CACHE = "ielts-vocab-" + VER;
var ASSETS = ["./", "./index.html", "./manifest.webmanifest",
              "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS) }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return k === CACHE ? null : caches.delete(k) }));
  }).then(function(){ return self.clients.claim() }));
});

self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
});

/* キャッシュ優先。ネットが無い時に「読み込めません」を出さないのが唯一の仕事。
   新しい版は裏で取りに行き、次に開いた時に反映する（stale-while-revalidate）。 */
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(req, {ignoreSearch:true}).then(function(hit){
      var net = fetch(req).then(function(res){
        if(res && res.status === 200) c.put(req, res.clone());
        return res;
      }).catch(function(){ return null });

      if(hit) return hit;
      return net.then(function(res){
        if(res) return res;
        if(req.mode === "navigate") return c.match("./index.html");
        return new Response("", {status:504, statusText:"offline"});
      });
    });
  }));
});
