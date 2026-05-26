
const JSON_FILES = ['dades/activitats_001.json', 'dades/activitats_002.json'];

async function importarActivitats() {
  const tasquesActuals = getTasques();
  const idsActuals = new Set(tasquesActuals.map(t => t.id));
  let noves = [];

  for (const fitxer of JSON_FILES) {
    try {
      const res = await fetch(fitxer);
      if (!res.ok) throw new Error('No trobat');
      const dades = await res.json();
      dades.forEach(t => {
        if (!idsActuals.has(t.id)) {
          noves.push(t);
          idsActuals.add(t.id);
        }
      });
    } catch (e) {
      console.warn('No s\'ha pogut carregar:', fitxer);
    }
  }

  if (noves.length > 0) {
    saveTasques([...tasquesActuals, ...noves]);
  }
}

async function importarFitxerManual(nomFitxer) {
  if (!nomFitxer.trim()) {
    alert('Escriu el nom del fitxer.');
    return;
  }

  const ruta = 'dades/' + nomFitxer.trim();

  try {
    const res = await fetch(ruta);
    if (!res.ok) throw new Error('No trobat');

    let dades = [];
    if (nomFitxer.toLowerCase().endsWith('.xml')) {
      const text = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      if (xmlDoc.querySelector("parsererror")) {
        throw new Error("El fitxer XML no és vàlid");
      }
      
      const tasquesNodes = xmlDoc.querySelectorAll('tasca');
      tasquesNodes.forEach(tascaNode => {
        dades.push({
          id: tascaNode.getAttribute('id'),
          titol: tascaNode.querySelector('titol')?.textContent || '',
          descripcio: tascaNode.querySelector('descripcio')?.textContent || '',
          data: tascaNode.querySelector('data')?.textContent || '',
          categoria: {
            
            nom: tascaNode.querySelector('categoria nom')?.textContent || '',
            color: tascaNode.querySelector('categoria color')?.textContent || '#ccc'
          },
          prioritat: tascaNode.querySelector('prioritat')?.textContent || 'Mitjana',
          realitzada: tascaNode.querySelector('realitzada')?.textContent === 'true'
        });
      });
    } else {
      dades = await res.json();
    }

    
    const tasquesActuals = getTasques();
    const idsActuals = new Set(tasquesActuals.map(t => t.id));
    let noves = 0;

    dades.forEach(t => {
      if (!idsActuals.has(t.id)) {
        tasquesActuals.push(t);
        idsActuals.add(t.id);
        noves++;
      }
    });

    saveTasques(tasquesActuals);
    document.getElementById('inputFitxer').value = '';
    alert(`Importades ${noves} tasques noves de "${nomFitxer}".`);
    renderLlistat();
  } catch (e) {
    alert('No s\'ha pogut carregar el fitxer "' + nomFitxer + '".\nAssegura\'t que existeix a la carpeta dades/');
  }
}

function renderLlistat() {
  const tasques = getTasques();
  const ulPendents = document.getElementById('pendents');
  const ulAcabades = document.getElementById('acabades');
  ulPendents.innerHTML = '';
  ulAcabades.innerHTML = '';

  tasques.forEach(t => {
    const li = document.createElement('li');
    li.className = 'tasca-item' + (t.realitzada ? ' realitzada' : '');

    const colorCategoria = (t.categoria && t.categoria.color) ? t.categoria.color : '#ccc';
    const nomCategoria = (t.categoria && t.categoria.nom) ? t.categoria.nom : 'Sense categoria';

    li.innerHTML = `
      <div class="tasca-cap">
        <span class="tasca-titol">${t.titol}</span>
        <span class="badge-prioritat prioritat-${t.prioritat.toLowerCase()}">${t.prioritat}</span>
        <span class="badge-cat" style="background:${colorCategoria}">${nomCategoria}</span>
      </div>
      <div class="tasca-info">
        <small>${t.data}</small>
        <p>${t.descripcio}</p>
      </div>
      <div class="tasca-accions">
        <label>
          <input type="checkbox" class="check-realitzada" data-id="${t.id}" ${t.realitzada ? 'checked' : ''}>
          Realitzada
        </label>
        <button class="btn-eliminar" data-id="${t.id}">Eliminar</button>
      </div>
    `;

    if (t.realitzada) {
      ulAcabades.appendChild(li);
    } else {
      ulPendents.appendChild(li);
    }
  });

  document.querySelectorAll('.check-realitzada').forEach(cb => {
    cb.addEventListener('change', (e) => toggleRealitzada(e.target.dataset.id));
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => eliminarTasca(e.target.dataset.id));
  });

  renderGrafic(getTasques());
}

function toggleRealitzada(id) {
  const tasques = getTasques().map(t => {
    if (t.id === id) t.realitzada = !t.realitzada;
    return t;
  });
  saveTasques(tasques);
  renderLlistat();
}

function eliminarTasca(id) {
  if (!confirm('Vols eliminar aquesta tasca?')) return;
  saveTasques(getTasques().filter(t => t.id !== id));
  renderLlistat();
}

document.getElementById('btnNova').addEventListener('click', () => {
  window.location.href = 'crear-tasca.html';
});

document.getElementById('btnPujar').addEventListener('click', () => {
  const nom = document.getElementById('inputFitxer').value;
  importarFitxerManual(nom);
});

document.getElementById('inputFitxer').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    importarFitxerManual(e.target.value);
  }
});

document.getElementById('btnEsborrar').addEventListener('click', () => {
  if (confirm('Vols esborrar totes les tasques guardades?')) {
    localStorage.removeItem('tasques');
    renderLlistat();
  }
});

renderLlistat();
