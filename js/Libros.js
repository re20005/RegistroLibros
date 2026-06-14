class Libros {
  // Obtener todos los libros
  static obtenerLibros() {
    return JSON.parse(localStorage.getItem("libros")) || [];
  }

  static normalizarLibro(data, libroExistente = null) {
    const libro = {
      titulo: (data.titulo || "").trim(),
      autor: (data.autor || "").trim(),
      isbn: (data.isbn || "").trim(),
      biblioteca: (data.biblioteca || "").trim(),
      estado: (data.estado || libroExistente?.estado || "disponible").trim().toLowerCase(),
    };

    if (!["disponible", "prestado"].includes(libro.estado)) {
      libro.estado = "disponible";
    }

    return libro;
  }

  // Guardar libros
  static guardarLibros(libros) {
    localStorage.setItem("libros", JSON.stringify(libros));
  }

  // Agregar libro (con opción de mostrar alerta)
  static agregarLibro(data, mostrarAlerta = true) {
    const libros = Libros.obtenerLibros();
    const libro = Libros.normalizarLibro(data);

    if (!libro.titulo || !libro.autor || !libro.isbn || !libro.biblioteca) {
      throw new Error("Título, autor, ISBN y biblioteca son obligatorios");
    }

    if (libros.some(item => item.isbn === libro.isbn)) {
      throw new Error("Ya existe un libro con ese ISBN");
    }

    libros.push(libro);
    Libros.guardarLibros(libros);

    if (mostrarAlerta) {
      alert("Libro agregado correctamente");
    }

    return libro;
  }

  // Ver todos los libros
  static verLibros() {
    return Libros.obtenerLibros();
  }

  // Eliminar libro por ISBN
  static eliminarLibro(isbn) {
    let libros = Libros.obtenerLibros();
    const existe = libros.some(libro => libro.isbn === isbn);

    if (!existe) {
      throw new Error("Libro no encontrado");
    }

    libros = libros.filter(libro => libro.isbn !== isbn);
    Libros.guardarLibros(libros);
    alert("Libro eliminado");
  }

  // Actualizar libro por ISBN
  static actualizarLibro(isbn, nuevosDatos) {
    let libros = Libros.obtenerLibros();
    const index = libros.findIndex(libro => libro.isbn === isbn);

    if (index !== -1) {
      const libroActualizado = Libros.normalizarLibro({ ...libros[index], ...nuevosDatos }, libros[index]);

      if (!libroActualizado.titulo || !libroActualizado.autor || !libroActualizado.isbn || !libroActualizado.biblioteca) {
        throw new Error("Título, autor, ISBN y biblioteca son obligatorios");
      }

      const isbnDuplicado = libros.some((libro, posicion) => posicion !== index && libro.isbn === libroActualizado.isbn);
      if (isbnDuplicado) {
        throw new Error("Ya existe otro libro con ese ISBN");
      }

      libros[index] = libroActualizado;
      Libros.guardarLibros(libros);
      alert("Libro actualizado");
      return libroActualizado;
    } else {
      throw new Error("Libro no encontrado");
    }
  }

  // Contar libros por biblioteca
  static contarPorBiblioteca() {
    let libros = Libros.obtenerLibros();
    let conteo = {};

    libros.forEach(libro => {
      const biblio = libro.biblioteca || "Sin biblioteca";
      conteo[biblio] = (conteo[biblio] || 0) + 1;
    });

    return conteo;
  }

  // Crear libros por defecto al iniciar (sin alertas)
  static crearLibrosPorDefecto() {
    let libros = Libros.obtenerLibros();

    if (libros.length === 0) {
      const iniciales = [
        { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", isbn: "9780307474728", biblioteca: "Biblioteca Nacional San Salvador" },
        { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", isbn: "9788491050295", biblioteca: "Biblioteca Santa Ana" },
        { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", isbn: "9780156013987", biblioteca: "Biblioteca San Miguel" },
        { titulo: "La Biblia", autor: "Varios autores", isbn: "9788428535958", biblioteca: "Biblioteca Ahuachapán" }
      ];

      // Guardar libros sin mostrar alertas
      iniciales.forEach(libro => Libros.agregarLibro(libro, false));
      console.log("Libros por defecto cargados en LocalStorage");
    }
  }
}
