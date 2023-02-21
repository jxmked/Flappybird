/**
 * Hi, I am planning to Create webpack plugin to handle
 * service worker for offline mode in thw future.
 * So, for now I'm going to use this old techniques
 *
 * */

var APP_PREFIX = 'Flappybird';
var VERSION = 'version_1';
var CACHE_NAME = APP_PREFIX + VERSION;
var prefix = '/';

var URLS = [''];

function getFiles() {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await fetch(prefix + 'asset-manifest.json', {
        method: 'GET'
      });

      URLS = URLS.concat(Object.values(JSON.parse(await res.text())));

      URLS = URLS.map(function (u) {
        return prefix + u;
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        if (/(google|gtag|adsense)/i.test(request.url)) return;
        return request;
      } else {
        try {
          return fetch(e.request).catch(function (err) {
            console.info('Offline mode');
          });
        } catch (err) {}
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    getFiles().then(function () {
      var i = [...new Set(URLS)];
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(i);
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
