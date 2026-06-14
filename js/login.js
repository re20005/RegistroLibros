// Cargar registros desde LocalStorage
let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  try {
    Users.crearAdminPorDefecto();
    Libros.crearLibrosPorDefecto();
  } catch (error) {
    console.error("Error al crear datos por defecto:", error);
  }
});

// Formulario Login
document.getElementById("formLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  registros = JSON.parse(localStorage.getItem("registros")) || [];

  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("loginMensaje");

  if (!correo || !password) {
    mensaje.textContent = "Todos los campos son obligatorios";
    return;
  }

  // Buscar usuario
  const usuario = registros.find(
    reg => reg.correo === correo && reg.password === password
  );

  if (!usuario) {
    mensaje.textContent = "Correo o contraseña incorrectos";
    return;
  }

  console.log("Usuario encontrado:", usuario);

  // Función para iniciar sesión
  const iniciarSesion = () => {
    sessionStorage.setItem(
      "sesionActiva",
      JSON.stringify({
        correo: usuario.correo,
        nombre: usuario.nombre,
        tiempo: Date.now()
      })
    );

    console.log("Redirigiendo...");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 500);
  };

  mensaje.textContent = `Bienvenido ${usuario.nombre}`;

  // Si no existe geolocalización, continuar
  if (!navigator.geolocation) {
    iniciarSesion();
    return;
  }

  // Obtener ubicación 
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        console.log("Ubicación obtenida:", lat, lon);

        const resp = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
        );

        const ubicacion = await resp.json();

        usuario.ubicacion = {
          ciudad: ubicacion.city || "Desconocida",
          pais: ubicacion.countryName || "Desconocido",
          lat,
          lon
        };

        localStorage.setItem("registros", JSON.stringify(registros));

        mensaje.textContent =
          `Bienvenido ${usuario.nombre}, ${usuario.ubicacion.ciudad}, ${usuario.ubicacion.pais}`;

      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
      }

      iniciarSesion();
    },
    (error) => {
      console.error("Error geolocalización:", error);
      iniciarSesion();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});

// Botón limpiar
document.getElementById("btnLimpiar").addEventListener("click", () => {
  document.getElementById("formLogin").reset();

  const mensaje = document.getElementById("loginMensaje");
  if (mensaje) {
    mensaje.textContent = "";
  }
});