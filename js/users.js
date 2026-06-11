class Users {
  // Crear admin si no existe
  static crearAdminPorDefecto() {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];

    const existeAdmin = registros.some(u => u.correo === "admin@gmail.com");

    if (!existeAdmin) {
      const admin = {
        nombre: "Admin",
        correo: "admin@gmail.com",
        password: "admin",
        cpassword: "admin",
        rol: "admin",
        ubicacion: null
      };
      registros.push(admin);
      localStorage.setItem("registros", JSON.stringify(registros));
      console.log("Admin creado por defecto");
    }
  }

  // Crear registro normal con validaciones y geolocalización
  static crearRegistro(data) {
    return new Promise((resolve) => {
      let registros = Users.obtenerRegistros();

      try {
        if (!data.nombre || !data.correo || !data.password || !data.cpassword) {
          throw new Error("Todos los campos son obligatorios");
        }
        if (data.password !== data.cpassword) {
          throw new Error("Las contraseñas no coinciden");
        }

        const correoNormalizado = data.correo.trim().toLowerCase();
        const yaExiste = registros.some((reg) => reg.correo.trim().toLowerCase() === correoNormalizado);
        if (yaExiste) {
          throw new Error("Este correo ya está registrado");
        }

        data.correo = correoNormalizado;
        data.rol = "user";
        data.ubicacion = null;

        const guardarRegistro = (mensaje) => {
          registros.push(data);
          Users.guardarRegistros(registros);
          alert(mensaje);
          resolve(true);
        };

        if (!navigator.geolocation) {
          guardarRegistro("Registro exitoso");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
              const resp = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
              );
              const ubicacion = await resp.json();

              data.ubicacion = {
                ciudad: ubicacion.city || "",
                pais: ubicacion.countryName || "",
                lat,
                lon,
              };

              guardarRegistro(`Registro exitoso en ${data.ubicacion.ciudad || "ubicación desconocida"}, ${data.ubicacion.pais || ""}`.trim());
            } catch (error) {
              guardarRegistro("Registro exitoso (sin ubicación exacta)");
            }
          },
          () => {
            guardarRegistro("Registro exitoso (sin geolocalización)");
          }
        );
      } catch (error) {
        alert("Error al crear registro: " + error.message);
        resolve(false);
      }
    });
  }

  // Obtener registros
  static obtenerRegistros() {
    return JSON.parse(localStorage.getItem("registros")) || [];
  }

  // Guardar registros
  static guardarRegistros(registros) {
    localStorage.setItem("registros", JSON.stringify(registros));
  }
}
