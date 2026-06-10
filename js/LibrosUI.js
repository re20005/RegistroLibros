class LibrosUI {

  // Mostrar lista de libros
  static mostrarLibros(lista) {
    const contenedor = document.getElementById("listaLibros");
    contenedor.innerHTML = "";

    lista.forEach(libro => {

      const item = document.createElement("li");

      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      item.innerHTML = `
        <div>
          <strong>${libro.titulo}</strong> - ${libro.autor}
          <br>
          ISBN: ${libro.isbn}
          <br>
          Biblioteca: ${libro.biblioteca}
          <br>
          Estado:
          <span class="${
            libro.estado === "prestado"
              ? "text-danger"
              : "text-success"
          }">
            ${libro.estado}
          </span>
        </div>

        <button
          class="btn btn-warning btn-sm"
          ${libro.estado === "prestado" ? "disabled" : ""}
        >
          ${libro.estado === "prestado"
            ? "Prestado"
            : "Prestar"}
        </button>
      `;

      const boton = item.querySelector("button");

      if (libro.estado !== "prestado") {
        boton.addEventListener("click", () => {
          LibrosUI.prestarLibro(libro);
        });
      }

      contenedor.appendChild(item);
    });
  }

  // Mostrar todos los libros
  static inicializarVista() {
    const libros = Libros.verLibros();
    LibrosUI.mostrarLibros(libros);
  }

  // Buscar libros
  static buscarLibros(termino) {

    const resultados = Libros.verLibros().filter(libro =>
      libro.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      libro.autor.toLowerCase().includes(termino.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(termino.toLowerCase()) ||
      libro.biblioteca.toLowerCase().includes(termino.toLowerCase())
    );

    LibrosUI.mostrarLibros(resultados);
  }

  // Crear préstamo
  static prestarLibro(libro) {

    const sesion =
      JSON.parse(localStorage.getItem("sesionActiva"));

    if (!sesion) {
      alert("Debes iniciar sesión");
      return;
    }

    let prestamos =
      JSON.parse(localStorage.getItem("prestamos")) || [];

    prestamos.push({
      id: Date.now(),
      usuario: sesion.correo,
      titulo: libro.titulo,
      isbn: libro.isbn,
      fechaPrestamo: new Date().toLocaleDateString(),
      estado: "activo"
    });

    localStorage.setItem(
      "prestamos",
      JSON.stringify(prestamos)
    );

    let libros = Libros.obtenerLibros();

    const index = libros.findIndex(
      l => l.isbn === libro.isbn
    );

    if (index !== -1) {
      libros[index].estado = "prestado";
      Libros.guardarLibros(libros);
    }

    alert(`Has prestado "${libro.titulo}"`);

    LibrosUI.inicializarVista();
  }

  // Configurar eventos
  static configurarEventos() {

    document
      .getElementById("btnBuscar")
      .addEventListener("click", () => {

        const termino =
          document.getElementById("buscar")
          .value.trim();

        LibrosUI.buscarLibros(termino);
      });

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        LibrosUI.inicializarVista();
      }
    );
  }
}