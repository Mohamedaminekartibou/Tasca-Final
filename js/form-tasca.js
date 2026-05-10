function carregarCategoriesAlSelector() {
  const categories = getCategories();
  const selector = document.getElementById('categoria');
  selector.innerHTML = '';

  if (categories.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '— Sense categories —';
    selector.appendChild(opt);
    return;
  }

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(cat);
    opt.textContent = cat.nom;
    selector.appendChild(opt);
  });
}

function validarFormulari(titol, descripcio, data, categoria, prioritat) {
  if (!titol.trim()) return 'El títol és obligatori.';
  if (!descripcio.trim()) return 'La descripció és obligatòria.';
  if (!data) return 'La data és obligatòria.';
  if (!categoria) return 'Has de seleccionar una categoria.';
  if (!prioritat) return 'Has de seleccionar una prioritat.';
  return null;
}

document.getElementById('form-tasca').addEventListener('submit', (e) => {
  e.preventDefault();

  const titol = document.getElementById('titol').value;
  const descripcio = document.getElementById('descripcio').value;
  const data = document.getElementById('data').value;
  const categoriaRaw = document.getElementById('categoria').value;
  const prioritat = document.getElementById('prioritat').value;

  const error = validarFormulari(titol, descripcio, data, categoriaRaw, prioritat);
  const missatgeError = document.getElementById('error-msg');

  if (error) {
    missatgeError.textContent = error;
    missatgeError.style.display = 'block';
    return;
  }

  missatgeError.style.display = 'none';

  let categoria;
  try {
    categoria = JSON.parse(categoriaRaw);
  } catch {
    categoria = { nom: categoriaRaw, color: '#ccc' };
  }

  const nova = crearTasca(titol, descripcio, data, categoria, prioritat);
  const tasques = getTasques();
  tasques.push(nova);
  saveTasques(tasques);

  alert('Tasca guardada correctament!');
  window.location.href = 'index.html';
});

carregarCategoriesAlSelector();