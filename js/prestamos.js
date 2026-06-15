class Prestamos {

    static obtenerPrestamos() {
        return JSON.parse(
            localStorage.getItem("prestamos")
        ) || [];
    }

    static guardarPrestamos(prestamos) {
        localStorage.setItem(
            "prestamos",
            JSON.stringify(prestamos)
        );
    }

    static obtenerPrestamosUsuario(correo) {

        const prestamos =
            Prestamos.obtenerPrestamos();

        return prestamos.filter(
            p => p.usuario === correo
        );
    }

    static obtenerHistorial() {
    return JSON.parse(localStorage.getItem("historial")) || [];
}

static registrarEnHistorial(entrada) {
    const historial = Prestamos.obtenerHistorial();
    historial.push(entrada);
    localStorage.setItem("historial", JSON.stringify(historial));
}

static obtenerHistorialUsuario(correo) {
    return Prestamos.obtenerHistorial().filter(h => h.usuario === correo);
}


    static devolverPrestamo(id) {
    let prestamos = Prestamos.obtenerPrestamos();
    const prestamo = prestamos.find(p => p.id === id);

    if (!prestamo) return;

    let libros = Libros.obtenerLibros();
    const libro = libros.find(l => l.isbn === prestamo.isbn);

    if (libro) {
     
        Prestamos.registrarEnHistorial({
            usuario: prestamo.usuario,
            titulo: prestamo.titulo,
            isbn: prestamo.isbn,
            evento: "devuelto",
            fecha: new Date().toLocaleDateString()
        });

        libro.estado = "disponible";
        Libros.actualizarLibro(libro.isbn, { estado: "disponible" }, false);
    }

    prestamos = prestamos.filter(p => p.id !== id);
    Prestamos.guardarPrestamos(prestamos);
}

}