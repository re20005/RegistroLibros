// Procesa datos en segundo plano
onmessage = function (e) {
  const libros = Array.isArray(e.data) ? e.data : [];
  const total = libros.length;
  const disponibles = libros.filter(libro => (libro.estado || "disponible") === "disponible").length;
  const prestados = libros.filter(libro => libro.estado === "prestado").length;
  const bibliotecas = new Set(libros.map(libro => libro.biblioteca).filter(Boolean)).size;

  postMessage({ total, disponibles, prestados, bibliotecas });
};
