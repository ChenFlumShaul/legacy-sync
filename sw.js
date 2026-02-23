const CACHE_NAME = 'legacy-sync-v1';
// רשימת הנכסים הבסיסיים לשמירה בזיכרון
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

// התקנת ה-Service Worker ושמירת הקבצים הבסיסיים
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// אסטרטגיה: מנסה להביא מהרשת, אם אין קליטה - מביא מהזיכרון (Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // אם הצלחנו להביא מהרשת, נשמור עותק מעודכן (לתמונות ואודיו מ-AWS)
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // אם אין אינטרנט, חפש בזיכרון המקומי
        return caches.match(event.request);
      })
  );
});