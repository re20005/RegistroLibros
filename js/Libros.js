class Libros {
  // Obtener todos los libros
  static obtenerLibros() {
    return JSON.parse(localStorage.getItem("libros")) || [];
  }

  // Guardar libros
  static guardarLibros(libros) {
    localStorage.setItem("libros", JSON.stringify(libros));
  }

  // Agregar libro (con opción de mostrar alerta)
  static agregarLibro(data, mostrarAlerta = true) {
    let libros = Libros.obtenerLibros();

    if (!data.titulo || !data.autor || !data.isbn || !data.biblioteca) {
      throw new Error("Título, autor, ISBN y biblioteca son obligatorios");
    }

    // Estado por defecto
    data.estado = "disponible";

    libros.push(data);
    Libros.guardarLibros(libros);

    if (mostrarAlerta) {
      alert("Libro agregado correctamente");
    }
  }

  // Ver todos los libros
  static verLibros() {
    return Libros.obtenerLibros();
  }

  // Eliminar libro por ISBN
  static eliminarLibro(isbn) {
    let libros = Libros.obtenerLibros();
    libros = libros.filter(libro => libro.isbn !== isbn);
    Libros.guardarLibros(libros);
    alert("Libro eliminado");
  }

  // Actualizar libro por ISBN
  static actualizarLibro(isbn, nuevosDatos) {
    let libros = Libros.obtenerLibros();
    const index = libros.findIndex(libro => libro.isbn === isbn);

    if (index !== -1) {
      libros[index] = { ...libros[index], ...nuevosDatos };
      Libros.guardarLibros(libros);
      alert("Libro actualizado");
    } else {
      alert("Libro no encontrado");
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

  {
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    isbn: "9780307474728",
    biblioteca: "Biblioteca Central"
  },

  {
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    isbn: "9788491050295",
    biblioteca: "Biblioteca El Congo"
  },

  {
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    isbn: "9780156013987",
    biblioteca: "Biblioteca Central"
  },

  {
    titulo: "La Biblia",
    autor: "Varios autores",
    isbn: "9788428535958",
    biblioteca: "Biblioteca San Salvador"
  },

  {
    titulo: "1984",
    autor: "George Orwell",
    isbn: "9780451524935",
    biblioteca: "Biblioteca Santa Ana"
  },

  {
    titulo: "El Hobbit",
    autor: "J.R.R. Tolkien",
    isbn: "9780547928227",
    biblioteca: "Biblioteca San Salvador"
  },

  {
    titulo: "Drácula",
    autor: "Bram Stoker",
    isbn: "9780486411095",
    biblioteca: "Biblioteca Central"
  },

  {
    titulo: "La Odisea",
    autor: "Homero",
    isbn: "9780140268867",
    biblioteca: "Biblioteca Sonsonate"
  },

  {
    titulo: "Crónica de una muerte anunciada",
    autor: "Gabriel García Márquez",
    isbn: "9781400034710",
    biblioteca: "Biblioteca Santa Ana"
  },

  {
    titulo: "Harry Potter y la piedra filosofal",
    autor: "J.K. Rowling",
    isbn: "9788478884452",
    biblioteca: "Biblioteca Central"
  }

];

      // Guardar libros sin mostrar alertas
      iniciales.forEach(libro => Libros.agregarLibro(libro, false));
      console.log("Libros por defecto cargados en LocalStorage");
    }
  }
}
