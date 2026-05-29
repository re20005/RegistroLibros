// Procesa datos en segundo plano
onmessage = function (e) {
  const registros = e.data;
  const total = registros.length;
  const activos = registros.filter(r => r.estado === "activo").length;
  postMessage(`Total: ${total}, Activos: ${activos}`);
};
