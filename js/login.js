// Cargar registros desde LocalStorage
let registros = JSON.parse(localStorage.getItem("registros")) || [];
  document.addEventListener("DOMContentLoaded", () => {
  Users.crearAdminPorDefecto(); 
  Libros.crearLibrosPorDefecto(); 
});


document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!correo || !password) {
    alert("Todos los campos son obligatorios");
    return;
  }



  // Buscar usuario en registros
  const usuario = registros.find(reg => reg.correo === correo && reg.password === password);

  if (usuario) {
    // Actualizar ubicación en cada inicio de sesión
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const resp = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
        );
        const ubicacion = await resp.json();

        usuario.ubicacion = {
          ciudad: ubicacion.city,
          pais: ubicacion.countryName,
          lat,
          lon,
        };

        // Guardar cambios LocalStorage
        localStorage.setItem("registros", JSON.stringify(registros));

        document.getElementById("loginMensaje").textContent =
          `Bienvenido ${usuario.nombre}, ultima ubicacion: ${usuario.ubicacion.ciudad}, ${usuario.ubicacion.pais}`;

        localStorage.setItem("sesionActiva", JSON.stringify({
          correo: usuario.correo,
          nombre: usuario.nombre,
          tiempo: Date.now()
        }));
        // Redirige a home
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500); // espera 1.5 segundos para mostrar el mensaje antes de redirigir

      } catch (error) {
        alert("Error al actualizar ubicación: " + error.message);
      }
    });
  } else {
    document.getElementById("loginMensaje").textContent = "Correo o contraseña incorrectos";
  }
});

// BOTÓN LIMPIAR
document.getElementById("btnLimpiar").addEventListener("click", function () {
  document.getElementById("formLogin").reset();
});
