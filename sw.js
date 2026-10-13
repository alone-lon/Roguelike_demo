/* 暗黑幸存者 Service Worker：网络优先+缓存兜底（更新秒生效，离线仍可玩） */
const CACHE = 'roguelike-demo-v2'; // 版本号升级即清旧缓存（v1 缓存优先策略会把旧版游戏锁死）
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './splash.webp', './menu-bg.webp', './settle-bg.webp'];

// 安装：预缓存核心资源
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// 激活：清理旧版本缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 请求：网络优先（更新即时生效），失败才走缓存兜底（离线可玩）
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok && e.request.url.startsWith(self.location.origin)) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)); // 顺手回填缓存
      }
      return res;
    }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))) // 离线兜底
  );
});
