/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "f88897161ac14fce9c6fd2e3c772f790"
  },
  {
    "url": "assets/css/0.styles.554128c8.css",
    "revision": "6092e6129fca9fa7e48c8b1a81ddbe0a"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.f46b35d6.js",
    "revision": "482860428bc46850870028af06499584"
  },
  {
    "url": "assets/js/3.9c15da83.js",
    "revision": "69f6c19c5e6c5438c09eedc53a15fb82"
  },
  {
    "url": "assets/js/4.80f93aa7.js",
    "revision": "049ed6f03eb459a00e9a3ada181c83b6"
  },
  {
    "url": "assets/js/5.380d9f9b.js",
    "revision": "66679621fc29b68ec98b139635408f7e"
  },
  {
    "url": "assets/js/6.47cbb720.js",
    "revision": "110d3070b56beedc4e73c29d6c9ab55f"
  },
  {
    "url": "assets/js/7.4ff7f0c8.js",
    "revision": "a3c5f0d1ae7c5461149d276d10862cdc"
  },
  {
    "url": "assets/js/8.50133102.js",
    "revision": "6919e380674125c355bf235807501eb8"
  },
  {
    "url": "assets/js/9.92fefd5f.js",
    "revision": "d5a44794f076ff5417c90ddbf68094b4"
  },
  {
    "url": "assets/js/app.c59534e8.js",
    "revision": "24180969b9d66d6f585648fbe72f0068"
  },
  {
    "url": "guide/install.html",
    "revision": "7e1ac70ebabc74ede958b74e650d9020"
  },
  {
    "url": "guide/quick-start.html",
    "revision": "8a3acd8ed70b85bc23407640926e5ead"
  },
  {
    "url": "index.html",
    "revision": "6ba03e0e57bc1c3162222fb75fb7e756"
  },
  {
    "url": "zh/guide/install.html",
    "revision": "461b69b65c0ea01f12ddcc0386e6c11c"
  },
  {
    "url": "zh/guide/quick-start.html",
    "revision": "2ba87b1a9e79f56dc8509f59df3bf735"
  },
  {
    "url": "zh/index.html",
    "revision": "a6ab9fc61f1a1c7027c13b3d71f4774c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
