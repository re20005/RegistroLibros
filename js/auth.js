class auth {
  static validarSesion() {
    const sesion = JSON.parse(sessionStorage.getItem("sesionActiva"));
    if (!sesion) {
      alert("Debes iniciar sesión primero");
      window.location.href = "login.html";
    }
    return sesion;
  }

  static cerrarSesion() {
    sessionStorage.removeItem("sesionActiva");
  }
}
