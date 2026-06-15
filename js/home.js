
class DashboardHome {
	static worker = null;

	static actualizarMetricas() {
		const libros = Libros.verLibros();

		if (!DashboardHome.worker) {
			DashboardHome.worker = new Worker("../js/workers.js");
			DashboardHome.worker.onmessage = (event) => {
				const metricas = event.data;
				const mapa = {
					totalLibrosHome: metricas.total,
					totalDisponiblesHome: metricas.disponibles,
					totalPrestadosHome: metricas.prestados,
					totalBibliotecasHome: metricas.bibliotecas,
				};

				Object.entries(mapa).forEach(([id, value]) => {
					const elemento = document.getElementById(id);
					if (elemento) {
						elemento.textContent = value;
					}
				});
			};
		}

		DashboardHome.worker.postMessage(libros);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	if (typeof Libros !== "undefined") {
		DashboardHome.actualizarMetricas();
	}
});
