
function crearTasca(titol, descripcio, data, categoria, prioritat) {
  const tasques = getTasques();
  const numeros = tasques
    .map(t => parseInt(t.id.replace('task-', '')))
    .filter(n => !isNaN(n));
  const seguent = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  const id = 'task-' + String(seguent).padStart(3, '0');

  return {
    id,
    titol,
    descripcio,
    data,
    categoria,
    prioritat,
    realitzada: false
  };
}

function crearCategoria(nom, color) {
  return { nom, color };
}
