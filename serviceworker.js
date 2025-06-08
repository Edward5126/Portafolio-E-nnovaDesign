const CACHE_NAME = 'Portafolio_Ennova-Design'; // Ya no necesitas cambiarlo manualmente

// Archivos base a precachear
const STATIC_ASSETS = [
  './',
  './index.html',
  './CSS/styles.css',
  './JS/script.js',
  './API/Proyectos.JSON',
  './DOCS/CurriculumEjemplo.pdf',
  './ICON/ColeccionIconos/style.css',
  './IMG/HeroImage.png',
  './IMG/IlustrativaContacto.jpg',
  './IMG/Logo.svg',
  './IMG/LogoHorizontal.svg'
];

// INSTALACIÓN: Precargar recursos esenciales
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Toma control de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVACIÓN: Limpiar caches antiguas (si cambias nombre más adelante)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Toma control de las páginas sin recarga
});

// FETCH: Responde con cache, y actualiza desde la red automáticamente
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // Solo manejar peticiones GET

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Cachear solo si es válido
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              !event.request.url.includes('chrome-extension')
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Si hay fallo de red, usar caché si existe
            return cachedResponse;
          });

        // Devuelve respuesta inmediata desde caché si está, si no espera fetch
        return cachedResponse || fetchPromise;
      });
    })
  );
});
