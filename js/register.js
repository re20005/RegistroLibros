document.getElementById("formRegistro").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();
  const cpassword = document.getElementById("cpassword").value.trim();

  try {
    if (!nombre || !correo || !password || !cpassword) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (password !== cpassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    const creado = await Users.crearRegistro({ nombre, correo, password, cpassword });
    if (creado) {
      e.target.reset();
      window.location.href = "login.html";
    }
  } catch (error) {
    alert("Error al validar: " + error.message);
  }
});

// BOTÓN LIMPIAR
document.getElementById("btnLimpiar").addEventListener("click", function () {
  document.getElementById("formRegistro").reset();
});
