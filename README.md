# 🎮 GameHub

Hub de jogos pra jogar na escola. Todos os jogos do Interstellar e mais.

## Como rodar

### Requisitos
- [Node.js](https://nodejs.org) instalado

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o servidor
npm start
```

Acessa: **http://localhost:3000**

---

## Estrutura

```
gamehub/
├── server.js          # Servidor Express
├── src/
│   └── games.js       # Lista de todos os jogos
└── public/
    ├── index.html     # Página principal
    ├── css/style.css  # Estilos
    └── js/app.js      # Frontend JS
```

## Adicionar jogos

Edita o arquivo `src/games.js` e adiciona um objeto no array:

```js
{ id: "nomedojogo", name: "Nome do Jogo", url: "https://...", emoji: "🎮", cat: "IO" }
```

Categorias disponíveis: IO, Ação, Arcade, Puzzle, Idle, Estratégia, Plataforma, Corrida, Especial

## Hospedar online (pra galera da escola acessar)

### Railway (grátis)
1. Cria conta em [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Conecta o repo e sobe

### Render (grátis)
1. Cria conta em [render.com](https://render.com)
2. "New Web Service" → conecta o repo
3. Start command: `npm start`

Depois é só mandar o link pra galera!
