const searchInput = document.getElementById('searchInput');
const btnSearchAsync = document.getElementById('btnSearchAsync');
const btnLoadDefault = document.getElementById('btnLoadDefault');
const metricsBar = document.getElementById('metricsBar');
const metricStatus = document.getElementById('metricStatus');
const metricTime = document.getElementById('metricTime');
const metricMethod = document.getElementById('metricMethod');
const statusMessage = document.getElementById('statusMessage');
const resultContainer = document.getElementById('resultContainer');

const API_URL = 'https://dog.ceo/api';

document.addEventListener('DOMContentLoaded', () => {
  loadDefaultDogs();
});

btnSearchAsync.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    searchDogByBreed(query);
  } else {
    loadDefaultDogs();
  }
});

btnLoadDefault.addEventListener('click', () => {
  searchInput.value = '';
  loadDefaultDogs();
});

// Mecanismo async/await para cargar perritos aleatorios
async function loadDefaultDogs() {
  resetUI();
  statusMessage.textContent = 'Cargando perritos aleatorios...';
  const startTime = performance.now();

  try {
    const response = await fetch(`${API_URL}/breeds/image/random/6`);
    const endTime = performance.now();

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    showMetrics(response.status, Math.round(endTime - startTime), 'async/await (Aleatorios)');
    renderDogCards(data.message);
  } catch (error) {
    statusMessage.textContent = `❌ Error: ${error.message}`;
  }
}

async function searchDogByBreed(breed) {
  resetUI();
  statusMessage.textContent = `Buscando raza: ${breed}...`;
  const startTime = performance.now();

  try {
    const response = await fetch(`${API_URL}/breed/${breed}/images/random/4`);
    const endTime = performance.now();

    if (!response.ok) {
      throw new Error('Raza no encontrada. Prueba con: hound, retriever, pug, terrier');
    }

    const data = await response.json();
    showMetrics(200, Math.round(endTime - startTime), 'async/await (Por Raza)');
    renderDogCards(data.message, breed.toUpperCase());
  } catch (error) {
    statusMessage.textContent = `❌ ${error.message}`;
  }
}

function resetUI() {
  statusMessage.textContent = '';
  resultContainer.innerHTML = '';
  metricsBar.classList.add('hidden');
}

function showMetrics(status, time, method) {
  metricStatus.textContent = `${status} OK`;
  metricTime.textContent = `${time} ms`;
  metricMethod.textContent = method;
  metricsBar.classList.remove('hidden');
}

function renderDogCards(images, breedTitle = 'Perrito Aleatorio') {
  statusMessage.textContent = '';
  if (!images || images.length === 0) {
    statusMessage.textContent = 'No se encontraron resultados.';
    return;
  }

  resultContainer.innerHTML = images.map(url => `
    <div class="cat-card">
      <img src="${url}" alt="Foto de perro">
      <div class="cat-info">
        <h3>${breedTitle}</h3>
        <p><strong>Estado:</strong> ¡Adorable y activo!</p>
      </div>
    </div>
  `).join('');
}