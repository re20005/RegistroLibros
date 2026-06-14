class LibrosUI {
  static worker = null;
  static isbnEnEdicion = null;

  // Mostrar lista de libros en el contenedor
  static mostrarLibros(lista) {
    const contenedor = document.getElementById("listaLibros");
    if (!contenedor) {
      return;
    }

    contenedor.innerHTML = "";

    lista.forEach(libro => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-start gap-3 flex-wrap";
      item.innerHTML = `
        <div class="me-auto">
          <div class="fw-bold">${libro.titulo}</div>
          <div>${libro.autor}</div>
          <small class="text-muted">ISBN: ${libro.isbn} | Biblioteca: ${libro.biblioteca} | Estado: ${libro.estado || "disponible"}</small>
        </div>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-warning" data-action="edit" data-isbn="${libro.isbn}">Editar</button>
          <button type="button" class="btn btn-outline-danger" data-action="delete" data-isbn="${libro.isbn}">Eliminar</button>
        </div>
      `;
      contenedor.appendChild(item);
    });
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
      if (elemento) {
        elemento.textContent = value;
      }
    });
  }

  static actualizarMetricas() {
    const libros = Libros.verLibros();

    if (!LibrosUI.worker) {
      const worker = new Worker("../js/workers.js");
      worker.onmessage = (event) => {
        LibrosUI.renderizarMetricas(event.data);
      };
      LibrosUI.worker = worker;
    }

    LibrosUI.worker.postMessage(libros);
  }

  static limpiarFormulario() {
    const form = document.getElementById("formLibro");
    if (form) {
      form.reset();
    }

    const isbnOriginal = document.getElementById("isbnOriginal");
    if (isbnOriginal) {
      isbnOriginal.value = "";
    }

    LibrosUI.isbnEnEdicion = null;

    const boton = document.getElementById("btnGuardarLibro");
    if (boton) {
      boton.textContent = "Guardar Libro";
    }
  }

  static llenarFormulario(libro) {
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("isbn").value = libro.isbn;

    const selectB = document.getElementById("biblioteca");
    const existe = Array.from(selectB.options).some(opt => opt.value === libro.biblioteca);

    if (!existe && libro.biblioteca) {
      const opt = document.createElement("option");
      opt.value = libro.biblioteca;
      opt.textContent = libro.biblioteca + " (Sede no oficial)";
      selectB.appendChild(opt);
    }

    selectB.value = libro.biblioteca;
    document.getElementById("estado").value = libro.estado || "disponible";
    document.getElementById("isbnOriginal").value = libro.isbn;
    LibrosUI.isbnEnEdicion = libro.isbn;

    const boton = document.getElementById("btnGuardarLibro");
    if (boton) {
      boton.textContent = "Actualizar Libro";
    }
  }

  static manejarEnvioFormulario(evento) {
    evento.preventDefault();

    const libro = {
      titulo: document.getElementById("titulo").value,
      autor: document.getElementById("autor").value,
      isbn: document.getElementById("isbn").value,
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

  // Mostrar todos los libros al cargar
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

  // Buscar libros y mostrarlos
  static buscarLibros(termino) {
    const resultados = Libros.verLibros().filter(libro =>
      libro.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      libro.autor.toLowerCase().includes(termino.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(termino.toLowerCase()) ||
      libro.biblioteca.toLowerCase().includes(termino.toLowerCase())
    );
    LibrosUI.mostrarLibros(resultados);
  }

  // Configurar eventos de la interfaz
  static configurarEventos() {
    const buscador = document.getElementById("btnBuscar");
    if (buscador) {
      buscador.addEventListener("click", () => {
        const termino = document.getElementById("buscar").value.trim();
        LibrosUI.buscarLibros(termino);
      });
    }

    const formulario = document.getElementById("formLibro");
    if (formulario) {
      formulario.addEventListener("submit", LibrosUI.manejarEnvioFormulario);
    }

    const botonLimpiar = document.getElementById("btnLimpiarLibro");
    if (botonLimpiar) {
      botonLimpiar.addEventListener("click", () => LibrosUI.limpiarFormulario());
    }

    const lista = document.getElementById("listaLibros");
    if (lista) {
      lista.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-action]");
        if (!boton) {
          return;
        }

        const isbn = boton.dataset.isbn;
        const accion = boton.dataset.action;
        const libro = Libros.verLibros().find(item => item.isbn === isbn);

        if (!libro) {
          alert("Libro no encontrado");
          return;
        }

        if (accion === "edit") {
          LibrosUI.llenarFormulario(libro);
          return;
        }

        if (accion === "delete") {
          const confirmado = confirm(`¿Eliminar \"${libro.titulo}\"?`);
          if (!confirmado) {
            return;
          }

          try {
            Libros.eliminarLibro(isbn);
            LibrosUI.inicializarVista();
            LibrosUI.limpiarFormulario();
          } catch (error) {
            alert(error.message);
          }
        }
      });
    }

    LibrosUI.inicializarVista();
  }
}
