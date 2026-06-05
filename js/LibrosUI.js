class LibrosUI {
  // Mostrar lista de libros en el contenedor
  static mostrarLibros(lista) {
    const contenedor = document.getElementById("listaLibros");
    contenedor.innerHTML = "";

    lista.forEach(libro => {
      const item = document.createElement("li");
      item.textContent = `${libro.titulo} - ${libro.autor} (ISBN: ${libro.isbn}) [${libro.biblioteca}]`;
      contenedor.appendChild(item);
    });
  }

  // Mostrar todos los libros al cargar
  static inicializarVista() {
    const libros = Libros.verLibros();
    LibrosUI.mostrarLibros(libros);
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
    document.getElementById("btnBuscar").addEventListener("click", () => {
      const termino = document.getElementById("buscar").value.trim();
      LibrosUI.buscarLibros(termino);
    });

    // Mostrar todos al cargar
    document.addEventListener("DOMContentLoaded", () => {
      LibrosUI.inicializarVista();
    });
  }
}
