const COUNTRIES_API = "https://restcountries.com/v3.1/name/";
const FAVORITES_URL = "https://favorites-mlva.onrender.com";
const VISITED_URL = "https://wishlist-16uy.onrender.com";
const COMMENTS_URL = "https://comments-service-wwou.onrender.com";

let currentCountry = null;

async function searchCountry() {
  const input = document.getElementById("countryInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerHTML = "<p>Escriu un país.</p>";
    return;
  }

  try {
    const response = await fetch(`${COUNTRIES_API}${input}`);
    const data = await response.json();

    if (!data || data.status === 404) {
      resultDiv.innerHTML = "<p>País no trobat.</p>";
      return;
    }

    const country = data[0];
    currentCountry = {
      name: country.name.common,
      capital: country.capital ? country.capital[0] : "No disponible"
    };

    resultDiv.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "No disponible"}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population}</p>

      <button onclick="addToFavorites()">Afegir a favorits</button>
      <button onclick="addToVisited()">Marcar com visitat</button>
      <button onclick="addComment()">Afegir comentari</button>
    `;
  } catch (error) {
    resultDiv.innerHTML = "<p>Error carregant el país.</p>";
    console.error(error);
  }
}

async function addToFavorites() {
  if (!currentCountry) return;

  await fetch(`${FAVORITES_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentCountry)
  });

  loadFavorites();
}

async function addToVisited() {
  if (!currentCountry) return;

  const visitedData = {
    name: currentCountry.name,
    year: new Date().getFullYear()
  };

  await fetch(`${VISITED_URL}/visited`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visitedData)
  });

  loadVisited();
}

async function addComment() {
  if (!currentCountry) return;

  const text = prompt("Escriu un comentari:");
  if (!text) return;

  await fetch(`${COMMENTS_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: currentCountry.name,
      text
    })
  });

  loadComments();
}

async function loadFavorites() {
  const response = await fetch(`${FAVORITES_URL}/favorites`);
  const data = await response.json();

  const list = document.getElementById("favoritesList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.capital || "Sense capital"})`;
    list.appendChild(li);
  });
}

async function loadVisited() {
  const response = await fetch(`${VISITED_URL}/visited`);
  const data = await response.json();

  const list = document.getElementById("visitedList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.year || "Sense any"}`;
    list.appendChild(li);
  });
}

async function loadComments() {
  const response = await fetch(`${COMMENTS_URL}/comments`);
  const data = await response.json();

  const list = document.getElementById("commentsList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.country}: ${item.text}`;
    list.appendChild(li);
  });
}