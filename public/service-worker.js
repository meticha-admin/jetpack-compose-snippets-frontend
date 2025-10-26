importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

if (workbox) {
    console.log("Workbox is loaded ✅");

    // Cache static assets (JS, CSS, Images)
    workbox.routing.registerRoute(
        /\.(?:js|css|png|jpg|jpeg|svg|gif)$/,
        new workbox.strategies.CacheFirst({
            cacheName: "assets",
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        })
    );
} else {
    console.log("Workbox didn't load ❌");
}
