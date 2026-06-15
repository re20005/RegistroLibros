document.addEventListener(
    "DOMContentLoaded",
    () => {

        const sesion =
            auth.validarSesion();

        const usuarioActivo =
            document.getElementById(
                "usuarioActivo"
            );

        usuarioActivo.textContent =
            `${sesion.nombre} - ${sesion.correo}`;

        const prestamos =
            Prestamos.obtenerPrestamosUsuario(
                sesion.correo
            );

        const lista =
            document.getElementById(
                "listaPrestamos"
            );

        lista.innerHTML = "";

        if (prestamos.length === 0) {

            lista.innerHTML =
                `
                <li class="list-group-item">
                    No tienes préstamos registrados
                </li>
                `;

            return;
        }

        prestamos.forEach(prestamo => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded";

            item.innerHTML = `
                <div class="me-auto">
                    <div class="fw-bold">${prestamo.titulo}</div>
                    <div class="small text-muted">ISBN: ${prestamo.isbn}</div>
                    <div class="small mt-1 text-primary">
                        <i class="fa-solid fa-calendar-day"></i> Prestado el: ${prestamo.fechaPrestamo}
                    </div>
                </div>
                <div class="text-end">
                    <span class="badge bg-success mb-2 d-block">Activo</span>
                    <button class="btn btn-outline-danger btn-sm devolver">
                        <i class="fa-solid fa-rotate-left"></i> Devolver
                    </button>
                </div>
            `;

                const boton =
                    item.querySelector(
                        ".devolver"
                    );

                boton.addEventListener(
                    "click",
                    () => {

                        Prestamos.devolverPrestamo(
                            prestamo.id
                        );

                        alert(
                            `Has devuelto "${prestamo.titulo}"`
                        );

                        location.reload();

                    }
                );

                lista.appendChild(
                    item
                );

            }
        );

        const logout =
            document.querySelector(
                ".cerrar-sesion-bnt"
            );

        if (logout) {

            logout.addEventListener(
                "click",
                e => {

                    e.preventDefault();

                    auth.cerrarSesion();

                    window.location.href =
                        "login.html";

                }
            );

        }

    }
);