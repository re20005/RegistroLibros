class LibrosUI {
  static worker = null;
  static isbnEnEdicion = null;

  // Mostrar lista de libros según el rol
  static mostrarLibros(lista) {
    const sesion = JSON.parse(sessionStorage.getItem("sesionActiva"));
    const rol = sesion ? sesion.rol : "user";

    // Detectar en qué contenedor renderizar
    const contenedorID = rol === "admin" ? "listaLibrosAdmin" : "listaLibrosUsuario";
    const contenedor = document.getElementById(contenedorID);
    
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (lista.length === 0) {
      contenedor.innerHTML = '<li class="list-group-item text-center">No se encontraron libros.</li>';
      return;
    }

    lista.forEach(libro => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded";
      
      let botones = "";
      if (rol === "admin") {
        botones = `
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-warning" data-action="edit" data-isbn="${libro.isbn}">Editar</button>
            <button class="btn btn-outline-danger" data-action="delete" data-isbn="${libro.isbn}">Eliminar</button>
          </div>
        `;
      } else {
        const estaPrestado = libro.estado === "prestado";
        botones = `
          <button class="btn btn-primary btn-sm" ${estaPrestado ? "disabled" : ""} id="prestar-${libro.isbn}">
            ${estaPrestado ? "Prestado" : "Prestar"}
          </button>
        `;
      }

      item.innerHTML = `
        <div class="me-auto">
          <div class="fw-bold">${libro.titulo} <span class="badge bg-secondary ms-1 small">${libro.categoria || "Literatura"}</span></div>
          <div class="small text-muted">${libro.autor} | ISBN: ${libro.isbn}</div>
          <div class="small">Sede: ${libro.biblioteca} | Estado: 
            <span class="${libro.estado === "prestado" ? "text-danger" : "text-success"}">
              ${libro.estado}
            </span>
          </div>
        </div>
        <div>${botones}</div>
      `;

      contenedor.appendChild(item);

      // Evento para el botón prestar (Usuario)
      if (rol !== "admin" && libro.estado !== "prestado") {
        document.getElementById(`prestar-${libro.isbn}`).addEventListener("click", () => {
          LibrosUI.prestarLibro(libro);
        });
      }
    });
  }

  static prestarLibro(libro) {
    const sesion = JSON.parse(sessionStorage.getItem("sesionActiva"));
    if (!sesion) {
      alert("Debes iniciar sesión");
      return;
    }

    let prestamos = JSON.parse(localStorage.getItem("prestamos")) || [];
    prestamos.push({
      id: Date.now(),
      usuario: sesion.correo,
      titulo: libro.titulo,
      isbn: libro.isbn,
      fechaPrestamo: new Date().toLocaleDateString(),
      estado: "activo"
    });

    localStorage.setItem("prestamos", JSON.stringify(prestamos));

    // Actualizar estado del libro
    try {
      Libros.actualizarLibro(libro.isbn, { estado: "prestado" });
      LibrosUI.inicializarVista();
      alert(`Has prestado "${libro.titulo}" correctamente.`);
    } catch (error) {
      alert(error.message);
    }
  }

  static renderizarMetricas(metricas) {
    const mapa = {
      totalLibrosHome: metricas.total,
      totalDisponiblesHome: metricas.disponibles,
      totalPrestadosHome: metricas.prestados,
      totalBibliotecasHome: metricas.bibliotecas,
    };

    Object.entries(mapa).forEach(([id, value]) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.textContent = value;
    });
  }

  static actualizarMetricas() {
    const libros = Libros.verLibros();
    if (!LibrosUI.worker) {
      LibrosUI.worker = new Worker("../js/workers.js");
      LibrosUI.worker.onmessage = (event) => {
        LibrosUI.renderizarMetricas(event.data);
      };
    }
    LibrosUI.worker.postMessage(libros);
  }

  static limpiarFormulario() {
    const form = document.getElementById("formLibro");
    if (form) form.reset();
    document.getElementById("isbnOriginal").value = "";
    LibrosUI.isbnEnEdicion = null;
    const btn = document.getElementById("btnGuardarLibro");
    if (btn) btn.textContent = "Guardar Libro";
  }

  static llenarFormulario(libro) {
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("isbn").value = libro.isbn;
    document.getElementById("categoria").value = libro.categoria || "Literatura";

    const selectB = document.getElementById("biblioteca");
    const existe = Array.from(selectB.options).some(opt => opt.value === libro.biblioteca);
    if (!existe && libro.biblioteca) {
      const opt = document.createElement("option");
      opt.value = libro.biblioteca;
      opt.textContent = libro.biblioteca + " (Original)";
      selectB.appendChild(opt);
    }
    selectB.value = libro.biblioteca;
    document.getElementById("estado").value = libro.estado || "disponible";
    document.getElementById("isbnOriginal").value = libro.isbn;
    LibrosUI.isbnEnEdicion = libro.isbn;

    const btn = document.getElementById("btnGuardarLibro");
    if (btn) btn.textContent = "Actualizar Libro";
  }

  static manejarEnvioFormulario(evento) {
    evento.preventDefault();
    const libro = {
      titulo: document.getElementById("titulo").value,
      autor: document.getElementById("autor").value,
      isbn: document.getElementById("isbn").value,
      categoria: document.getElementById("categoria").value,
      biblioteca: document.getElementById("biblioteca").value,
      estado: document.getElementById("estado").value,
    };

    try {
      if (LibrosUI.isbnEnEdicion) {
        Libros.actualizarLibro(LibrosUI.isbnEnEdicion, libro);
      } else {
        Libros.agregarLibro(libro);
      }
      LibrosUI.limpiarFormulario();
      LibrosUI.inicializarVista();
    } catch (error) {
      alert(error.message);
    }
  }

  static inicializarVista() {
    LibrosUI.llenarComboBibliotecas();
    const libros = Libros.verLibros();
    LibrosUI.mostrarLibros(libros);
    LibrosUI.actualizarMetricas();
  }

  static llenarComboBibliotecas() {
    const selectB = document.getElementById("biblioteca");
    if (selectB && selectB.options.length <= 1) {
      if (typeof Biblioteca !== "undefined") {
        const bibs = Biblioteca.obtenerBibliotecas();
        bibs.forEach(b => {
          const opt = document.createElement("option");
          opt.value = b.nombre;
          opt.textContent = b.nombre;
          selectB.appendChild(opt);
        });
      }
    }
  }

  static buscarLibros(termino) {
    const resultados = Libros.verLibros().filter(libro =>
      libro.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      libro.autor.toLowerCase().includes(termino.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(termino.toLowerCase()) ||
      (libro.categoria && libro.categoria.toLowerCase().includes(termino.toLowerCase()))
    );
    LibrosUI.mostrarLibros(resultados);
  }

  static configurarEventos() {
    const buscador = document.getElementById("btnBuscar");
    if (buscador) {
      buscador.addEventListener("click", () => {
        const t = document.getElementById("buscar").value.trim();
        LibrosUI.buscarLibros(t);
      });
    }

    const form = document.getElementById("formLibro");
    if (form) form.addEventListener("submit", LibrosUI.manejarEnvioFormulario);

    const btnL = document.getElementById("btnLimpiarLibro");
    if (btnL) btnL.addEventListener("click", () => LibrosUI.limpiarFormulario());

    const listaA = document.getElementById("listaLibrosAdmin");
    if (listaA) {
      listaA.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const isbn = btn.dataset.isbn;
        const accion = btn.dataset.action;
        const libro = Libros.verLibros().find(item => item.isbn === isbn);

        if (accion === "edit" && libro) {
          LibrosUI.llenarFormulario(libro);
        } else if (accion === "delete") {
          if (confirm(`¿Eliminar \"${libro.titulo}\"?`)) {
            Libros.eliminarLibro(isbn);
            LibrosUI.inicializarVista();
          }
        }
      });
    }

    LibrosUI.inicializarVista();
  }
}