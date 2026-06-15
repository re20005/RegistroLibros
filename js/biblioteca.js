// js/home.js
class Biblioteca {
  static cargarBibliotecas() {
    const bibliotecas = [
      { departamento: "Ahuachapán", nombre: "Biblioteca Ahuachapán", lat: 13.9214, lon: -89.8450 },
      { departamento: "Santa Ana", nombre: "Biblioteca Santa Ana", lat: 13.9942, lon: -89.5597 },
      { departamento: "Sonsonate", nombre: "Biblioteca Sonsonate", lat: 13.7183, lon: -89.7246 },
      { departamento: "Chalatenango", nombre: "Biblioteca Chalatenango", lat: 14.0333, lon: -89.0500 },
      { departamento: "La Libertad", nombre: "Biblioteca La Libertad", lat: 13.6740, lon: -89.2850 },
      { departamento: "San Salvador", nombre: "Biblioteca Nacional San Salvador", lat: 13.6929, lon: -89.2182 },
      { departamento: "Cuscatlán", nombre: "Biblioteca Cuscatlán", lat: 13.7167, lon: -89.1000 },
      { departamento: "La Paz", nombre: "Biblioteca La Paz", lat: 13.4667, lon: -88.9500 },
      { departamento: "Cabañas", nombre: "Biblioteca Cabañas", lat: 13.9167, lon: -88.6333 },
      { departamento: "San Vicente", nombre: "Biblioteca San Vicente", lat: 13.6333, lon: -88.8000 },
      { departamento: "Usulután", nombre: "Biblioteca Usulután", lat: 13.3500, lon: -88.4500 },
      { departamento: "San Miguel", nombre: "Biblioteca San Miguel", lat: 13.4833, lon: -88.1833 },
      { departamento: "Morazán", nombre: "Biblioteca Morazán", lat: 13.7000, lon: -88.1167 },
      { departamento: "La Unión", nombre: "Biblioteca La Unión", lat: 13.3333, lon: -87.9667 }
    ];
    localStorage.setItem("bibliotecas", JSON.stringify(bibliotecas));
  }

  static obtenerBibliotecas() {
    return JSON.parse(localStorage.getItem("bibliotecas")) || [];
  }

  static distancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static masCercana(lat, lon) {
    const bibliotecas = this.obtenerBibliotecas();
    let masCercana = null;
    let menorDistancia = Infinity;

    bibliotecas.forEach(b => {
      const d = this.distancia(lat, lon, b.lat, b.lon);
      if (d < menorDistancia) {
        menorDistancia = d;
        masCercana = b;
      }
    });

    return masCercana;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  const sesion = auth.validarSesion(); 

  if (sesion) {
    if (!localStorage.getItem("bibliotecas")) {
      Biblioteca.cargarBibliotecas();
    }

    const usuarioActivo = document.getElementById("usuarioActivo");
    if (usuarioActivo) {
      usuarioActivo.textContent = `${sesion.nombre} _ ${sesion.correo}`;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const cercana = Biblioteca.masCercana(lat, lon);
      if (cercana && usuarioActivo) {
        usuarioActivo.textContent += ` | Biblioteca más cercana: ${cercana.nombre} (${cercana.departamento})`;
      }
    });
  }

  // Cerrar sesión
  const logoutLink = document.querySelector(".cerrar-sesion-bnt");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      auth.cerrarSesion(); 
      window.location.href = "login.html";
    });
  }
});