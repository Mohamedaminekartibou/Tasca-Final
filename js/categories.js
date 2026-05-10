
function renderCategories() {
  const categories = getCategories();
  const llista = document.getElementById('llistaCategories');
  llista.innerHTML = '';

  if (categories.length === 0) {
    llista.innerHTML = '<li class="buit">No hi ha categories. Afegeix-ne una!</li>';
    return;
  }

  categories.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'cat-item';
    li.innerHTML = `
      <span class="cat-color" style="background:${cat.color}"></span>
      <span class="cat-nom">${cat.nom}</span>
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    llista.appendChild(li);
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      eliminarCategoria(parseInt(e.target.dataset.index));
    });
  });
}

function afegirCategoria() {
  const input = document.getElementById('inputCategoria');
  const colorInput = document.getElementById('colorCategoria');
  const nom = input.value.trim();
  const color = colorInput.value;

  if (!nom) {
    alert('Escriu un nom per la categoria.');
    return;
  }

  const categories = getCategories();
  const jaExisteix = categories.some(c => c.nom.toLowerCase() === nom.toLowerCase());

  if (jaExisteix) {
    alert('Ja existeix una categoria amb aquest nom.');
    return;
  }

  categories.push(crearCategoria(nom, color));
  saveCategories(categories);
  input.value = '';
  colorInput.value = '#2d6cdf';
  renderCategories();
}

function eliminarCategoria(index) {
  if (!confirm('Vols eliminar aquesta categoria?')) return;
  const categories = getCategories();
  categories.splice(index, 1);
  saveCategories(categories);
  renderCategories();
}

document.getElementById('btnAfegir').addEventListener('click', afegirCategoria);


renderCategories();