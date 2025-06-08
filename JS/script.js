function AbrirModal(){
    document.getElementById("ModalMenu").classList.remove("oculto");
    document.getElementById("ModalMenu").classList.add("visible");
    document.querySelector("body").classList.add("ScrollEstatico");
}

function CerrarModal() {
    document.getElementById("ModalMenu").classList.add("oculto");
    document.getElementById("ModalMenu").classList.remove("visible");
    document.querySelector("body").classList.remove("ScrollEstatico");
}

// Simulando consumo de API con JSON local para rellenar la sección "Portafolio"

var ListaProyectosGlobal;

fetch("API/Proyectos.JSON")
.then(response => response.json())
.then(API => IniciarPortafolio(API))
.catch(error => console.error("Error al recuperar la lista de Proyectos (API/Proyectos.JSON)"));

function IniciarPortafolio(ListaAPI){
    LlenarPortafolio(ListaAPI);
    LlenarCintaTestimonios(ListaAPI);
    ListaProyectosGlobal = ListaAPI;
}

function LlenarCintaTestimonios(ListaProyectos) {
    let TotalLogos = 0;
    let TotalIndLogos = 0;
    let ContenedorCarrusel = document.querySelector(".CarruselEmpresas");

    const CintaLogos = document.createElement("div");
    CintaLogos.className = "CintaLogos";

    ListaProyectos.forEach(Proyecto => {
        TotalIndLogos++;
        const item = document.createElement("img");
        item.alt = Proyecto.nombre;
        item.src = Proyecto.logo;
        CintaLogos.appendChild(item);
    });

    do {
        const SiguienteCintaLogos = CintaLogos.cloneNode(true);
        ContenedorCarrusel.appendChild(SiguienteCintaLogos);
        TotalLogos += TotalIndLogos;
    } while (TotalLogos < 32);

    console.log(TotalIndLogos);
    console.log(TotalLogos);
}

function LlenarPortafolio(ListaProyectos) {
    ListaProyectos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    document.getElementById("GaleriaProyectos").innerHTML = "";

    ListaProyectos.forEach(Proyecto => {
        if (Proyecto.enlace != "") {
            let ListaServicios = "";

            Proyecto.categorias.forEach(cat => {
                ListaServicios += cat + ", ";
            });
        
            document.getElementById("GaleriaProyectos").innerHTML += `
                <a href="${Proyecto.enlace}" target="_blank" rel="noopener noreferrer">
                    <div class="TarjetaProyecto">
                        <img src="${Proyecto.imagen}" alt="${Proyecto.nombre}" class="ImagenProyecto">
                        <span class="NombreProyecto">${Proyecto.nombre}</span><br>
                        <span class="DescripcionProyecto">${ListaServicios.slice(0, -2)}</span>
                    </div>
                </a>`;
        } else {
            let ListaServicios = "";

            Proyecto.categorias.forEach(cat => {
                ListaServicios += cat + ", ";
            });

            document.getElementById("GaleriaProyectos").innerHTML += `
                <a href="${Proyecto.enlace}" onClick="event.preventDefault()" target="_blank" rel="noopener noreferrer" class="NoClick">
                    <div class="TarjetaProyecto">
                        <img src="${Proyecto.imagen}" alt="${Proyecto.nombre}" class="ImagenProyecto">
                        <span class="NombreProyecto">${Proyecto.nombre}</span><br>
                        <span class="DescripcionProyecto">${ListaServicios.slice(0, -2)}</span>
                    </div>
                </a>`;
            }
    });
}

function FiltrarPortafolio(FiltroServ){
    let ListaServiciosCompleta = ["Todo", "Diseño Web", "Diseño Publicitario", "Identidad de Marca", "UI / UX", "Identidad de Creador"];
    let ListaBotonesFiltro = document.querySelectorAll(".Filtro");
    
    ListaBotonesFiltro.forEach((Filt, index) => {
        if (index == FiltroServ) {
            Filt.classList.add("FiltroSeleccionado");
        } else {
            Filt.classList.remove("FiltroSeleccionado");
        }
    });

    if (FiltroServ != 0) {
        let ListaProyectosFiltrada = ListaProyectosGlobal.filter(proyecto => 
            proyecto.categorias.includes(ListaServiciosCompleta[FiltroServ])
        );

        LlenarPortafolio(ListaProyectosFiltrada);
    } else {
        LlenarPortafolio(ListaProyectosGlobal);
    }
}

const BotonMenu = document.getElementById('MenuHamburguesa');
const EnlacesNav = document.getElementById('EnlacesNav');
const EnlacesIndNav = document.querySelectorAll(".EnlaceIndNav");

EnlacesIndNav.forEach(Enlaces => {
    Enlaces.addEventListener('click', () => {
  // Alterna la clase 'activo' para el menú
  EnlacesNav.classList.toggle('activo');
  
  // Cambia el ícono de hamburguesa por la "X" y viceversa
  const icon = BotonMenu.querySelector('i');
  if (EnlacesNav.classList.contains('activo')) {
    icon.classList.remove('icon-hamburguesa');
    icon.classList.add('icon-Cruz');
  } else {
    icon.classList.remove('icon-Cruz');
    icon.classList.add('icon-hamburguesa');
  }
});
});

BotonMenu.addEventListener('click', () => {
  // Alterna la clase 'activo' para el menú
  EnlacesNav.classList.toggle('activo');
  
  // Cambia el ícono de hamburguesa por la "X" y viceversa
  const icon = BotonMenu.querySelector('i');
  if (EnlacesNav.classList.contains('activo')) {
    icon.classList.remove('icon-hamburguesa');
    icon.classList.add('icon-Cruz');
  } else {
    icon.classList.remove('icon-Cruz');
    icon.classList.add('icon-hamburguesa');
  }
});

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./serviceworker.js')
//         .then(reg => console.log('Service Worker registrado', reg))
//         .catch(err => console.error('Error al registrar Service Worker', err));
//     });
// } else {
//     console.warn('Service Worker no soportado en este navegador.');
// }

// Registro del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado:', registration.scope);

        // Detectar si hay una nueva versión
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Ya hay una versión activa, así que esto es una nueva versión
              mostrarAvisoDeActualización();
            }
          };
        };
      })
      .catch(error => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  });
}

// Mostrar mensaje al usuario para recargar
function mostrarAvisoDeActualización() {
  const aviso = document.createElement('div');
  aviso.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #222;
      color: white;
      padding: 1em 1.5em;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: sans-serif;
    ">
      <span>🔄 Nueva versión disponible</span>
      <button style="
        margin-left: 1em;
        background: #00cc88;
        color: white;
        border: none;
        padding: 0.5em 1em;
        border-radius: 6px;
        cursor: pointer;
      ">Actualizar</button>
    </div>
  `;

  const boton = aviso.querySelector('button');
  boton.addEventListener('click', () => {
    window.location.reload(); // Recarga para usar la nueva versión
  });

  document.body.appendChild(aviso);
}
