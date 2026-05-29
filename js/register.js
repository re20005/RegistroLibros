let registros = JSON.parse(localStorage.getItem("registros")) || [];


// FUNCIONES CRUD 
function crearRegistro(data) {
  try {
    if (!data.nombre || !data.correo || !data.password || !data.cpassword) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (data.password !== data.cpassword) {
      throw new Error("Las contraseñas no coinciden");
    }

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

          // Agregar ubicacion 
          data.ubicacion = {
            ciudad: ubicacion.city,
            pais: ubicacion.countryName,
            lat,
            lon,
          };

          registros.push(data);
          localStorage.setItem("registros", JSON.stringify(registros));

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

document.getElementById("formRegistro").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();
  const cpassword = document.getElementById("cpassword").value.trim();

  if (!nombre || !correo || !password || !cpassword) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (password !== cpassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  crearRegistro({ nombre, correo, password, cpassword });
  e.target.reset();
});

// BOTÓN LIMPIAR
document.getElementById("btnLimpiar").addEventListener("click", function () {
  document.getElementById("formRegistro").reset();
});
