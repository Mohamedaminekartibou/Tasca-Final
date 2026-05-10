
let chartInstance = null;

function renderGrafic(tasques) {
  const mesos = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun',
                  'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];

  const comptador = Array(12).fill(0);
  tasques
    .filter(t => t.realitzada)
    .forEach(t => {
      const mes = new Date(t.data).getMonth();
      if (mes >= 0) comptador[mes]++;
    });

  const ctx = document.getElementById('grafica').getContext('2d');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mesos,
      datasets: [{
        label: 'Tasques realitzades per mes',
        data: comptador,
        backgroundColor: '#2d6cdf',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
}
