let allGames = [];
let currentCat = "Todos";
let currentGame = null;
let searchTimeout = null;

async function init() {
  await loadCategories();
  await loadGames();
  document.getElementById("search").addEventListener("input", onSearch);
}

async function loadCategories() {
  const res = await fetch("/api/categories");
  const cats = await res.json();
  const bar = document.getElementById("catsBar");
  bar.innerHTML = "";
  cats.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (c === currentCat ? " active" : "");
    btn.textContent = c;
    btn.onclick = () => selectCat(c);
    bar.appendChild(btn);
  });
}

async function loadGames(cat, q) {
  const params = new URLSearchParams();
  if (cat && cat !== "Todos") params.set("cat", cat);
  if (q) params.set("q", q);
  const res = await fetch("/api/games?" + params);
  allGames = await res.json();
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById("grid");
  document.getElementById("gameCount").textContent = allGames.length + " jogos";
  grid.innerHTML = "";

  if (!allGames.length) {
    grid.innerHTML = `
      <div class="empty">
        <p>🔍</p>
        <p>Nenhum jogo encontrado. Tenta outra busca!</p>
      </div>`;
    return;
  }

  allGames.forEach((g, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = Math.min(i * 0.02, 0.3) + "s";
    card.onclick = () => openGame(g);
    card.innerHTML = `
      <div class="card-thumb">
        <span class="card-emoji">${g.emoji}</span>
        <div class="card-overlay">▶</div>
      </div>
      ${g.novo ? '<span class="badge-new">NEW</span>' : ""}
      <div class="card-info">
        <div class="card-name">${g.name}</div>
        <div class="card-cat">${g.cat}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function selectCat(cat) {
  currentCat = cat;
  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.textContent === cat);
  });
  const q = document.getElementById("search").value.trim();
  loadGames(cat, q || undefined);
}

function onSearch(e) {
  const q = e.target.value.trim();
  const clearBtn = document.getElementById("clearBtn");
  clearBtn.classList.toggle("show", q.length > 0);
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadGames(currentCat, q || undefined);
  }, 200);
}

function clearSearch() {
  const input = document.getElementById("search");
  input.value = "";
  document.getElementById("clearBtn").classList.remove("show");
  loadGames(currentCat);
}

function openGame(g) {
  currentGame = g;
  document.getElementById("modalEmoji").textContent = g.emoji;
  document.getElementById("modalTitle").textContent = g.name;
  document.getElementById("modalCat").textContent = g.cat;

  const loading = document.getElementById("frameLoading");
  const frame = document.getElementById("gameFrame");
  loading.classList.remove("hide");

  const proxyUrl = "/proxy?url=" + encodeURIComponent(g.url);
  frame.src = proxyUrl;

  frame.onload = () => {
    setTimeout(() => loading.classList.add("hide"), 400);
  };

  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("gameFrame").src = "";
  document.getElementById("frameLoading").classList.remove("hide");
  document.body.style.overflow = "";
  currentGame = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById("modal")) closeModal();
}

function openExternal() {
  if (currentGame) window.open(currentGame.url, "_blank");
}

function toggleFullscreen() {
  const frame = document.getElementById("gameFrame");
  if (frame.requestFullscreen) frame.requestFullscreen();
  else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("search").focus();
  }
});

init();
