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
    let registros = Users.obtenerRegistros();

    try {
      // Validaciones básicas
      if (!data.nombre || !data.correo || !data.password || !data.cpassword) {
        throw new Error("Todos los campos son obligatorios");
      }
      if (data.password !== data.cpassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      // Rol por defecto
      data.rol = "user";

      // Obtener ubicacion
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            const resp = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
            );
            const ubicacion = await resp.json();

            // Agregar ubicación
            data.ubicacion = {
              ciudad: ubicacion.city,
              pais: ubicacion.countryName,
              lat,
              lon,
            };

            // Guardar usuario
            registros.push(data);
            Users.guardarRegistros(registros);

            alert(`Registro exitoso en ${ubicacion.city}, ${ubicacion.countryName}`);
          } catch (error) {
            alert("Error al obtener datos de la API: " + error.message);
          }
        },
        (error) => {
          alert("Error de geolocalización: " + error.message);
        }
      );
    } catch (error) {
      alert("Error al crear registro: " + error.message);
    }
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
