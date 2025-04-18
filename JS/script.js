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
    ListaProyectosGlobal = ListaAPI;
}

function LlenarPortafolio(ListaProyectos) {
    ListaProyectos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    document.getElementById("GaleriaProyectos").innerHTML = "";

    ListaProyectos.forEach(Proyecto => {
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./serviceworker.js')
        .then(reg => console.log('Service Worker registrado', reg))
        .catch(err => console.error('Error al registrar Service Worker', err));
    });
} else {
    console.warn('Service Worker no soportado en este navegador.');
}