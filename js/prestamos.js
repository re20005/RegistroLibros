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

    static devolverPrestamo(id) {

        let prestamos =
            Prestamos.obtenerPrestamos();

        const prestamo =
            prestamos.find(
                p => p.id === id
            );

        if (!prestamo) {
            return;
        }

        let libros =
            Libros.obtenerLibros();

        const libro =
            libros.find(
                l => l.isbn === prestamo.isbn
            );

        if (libro) {

            libro.estado =
                "disponible";

            Libros.guardarLibros(
                libros
            );
        }

        prestamos =
            prestamos.filter(
                p => p.id !== id
            );

        Prestamos.guardarPrestamos(
            prestamos
        );
    }

}