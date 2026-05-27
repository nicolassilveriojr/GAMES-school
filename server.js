const express = require("express");
const http = require("http");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");
const { createServer: createWispServer } = require("wisp-server-node");
const games = require("./src/games");

const app = express();
const PORT = process.env.PORT || 3000;

const bare = createBareServer("/bare/");

app.use(express.static(path.join(__dirname, "public"), {
  setHeaders(res, filePath) {
    if (filePath.endsWith("uv.sw.js")) {
      res.setHeader("Service-Worker-Allowed", "/");
    }
  }
}));

app.get("/api/games", (req, res) => {
  const { cat, q, sort } = req.query;
  let list = [...games];
  if (cat && cat !== "Todos") list = list.filter(g => g.cat === cat);
  if (q) list = list.filter(g =>
    g.name.toLowerCase().includes(q.toLowerCase()) ||
    (g.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
  );
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

app.get("/api/categories", (req, res) => {
  const cats = ["Todos", ...new Set(games.map(g => g.cat))];
  const counts = {};
  games.forEach(g => { counts[g.cat] = (counts[g.cat] || 0) + 1; });
  res.json(cats.map(c => ({ name: c, count: c === "Todos" ? games.length : (counts[c] || 0) })));
});

app.get("/api/random", (req, res) => {
  res.json(games[Math.floor(Math.random() * games.length)]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (req.url.startsWith("/wisp/")) {
    createWispServer({ server }).handleRequest(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`\n🎮 GameHub rodando em http://localhost:${PORT}\n`);
});