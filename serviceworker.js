// Nombre de la caché
const NombreCache = 'Portafolio_Ennova-Design';

// Archivos a cachear
const URLsaCache = [
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

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NombreCache)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(URLsaCache);
      })
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== NombreCache) {
            console.log('Cache viejo eliminado:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Interceptar fetch y servir de caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
