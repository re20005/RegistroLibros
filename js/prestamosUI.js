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

        prestamos.forEach(
            prestamo => {

                const item =
                    document.createElement(
                        "li"
                    );

                item.classList.add(
                    "list-group-item"
                );

                item.innerHTML = `
                    <strong>
                        ${prestamo.titulo}
                    </strong>

                    <br>

                    ISBN:
                    ${prestamo.isbn}

                    <br>

                    Fecha:
                    ${prestamo.fechaPrestamo}

                    <br>

                    Estado:
                    ${prestamo.estado}

                    <br><br>

                    <button
                        class="btn btn-success btn-sm devolver">

                        Devolver

                    </button>
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