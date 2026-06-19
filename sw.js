// Service Worker 隱形小管家 - 負責在背景靜默監聽並發送鬧鐘通知
const CACHE_NAME = 'alarm-pwa-v1';
const ASSETS = [
    'index.html',
    'manifest.json'
];

// 安裝時快取離線檔案
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// 攔截請求，實現離線也能開啟
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// 關鍵：監聽雲端送來的 push (推播訊號) 事件！
self.addEventListener('push', event => {
    let payload = {
        title: "⏰ 雲端鬧鐘時間到了！",
        body: "起床大作戰！新的一天開始囉，加油！"
    };

    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    const options = {
        body: payload.body,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><circle cx="12" cy="12" r="10" fill="%231e1b4b"/><path d="M12 8v4l3 3" stroke="%23818cf8" stroke-width="2" stroke-linecap="round"/></svg>',
        badge: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><circle cx="12" cy="12" r="10" fill="%231e1b4b"/><path d="M12 8v4l3 3" stroke="%23818cf8" stroke-width="2" stroke-linecap="round"/></svg>',
        vibrate: [300, 100, 300, 100, 400],
        requireInteraction: true // 通知會一直停留在鎖定畫面
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});