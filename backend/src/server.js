const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Adicionado o import do cors
const setupRabbitMQ = require('../rabitmq/filaAnime')
const consumeAnimeMessage = require('../rabitmq/animeConsumer')
const consumeLogMessage = require('../rabitmq/LogConsumer')

consumeAnimeMessage()
consumeLogMessage();



const PORT = process.env.PORT || 3004
// Criando uma instância do express
const app = express();

// Configuração do CORS
app.use(cors());
app.use(express.json())

// Importando rotas
const createAnime = require('../routes/create-anime');
const readAnime = require('../routes/read-anime');
const login = require('../routes/login-router');
const log = require('../routes/log-router');

// Utilizando as rotas
app.use('/create', createAnime);
app.use('/login', login);
app.use('/read', readAnime);
app.use('/logsearch', log);



// Criando o servidor HTTP usando o express
const server = http.createServer(app);

// Configurando o Socket.IO para usar o servidor HTTP
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("set_username", (username) => {
    socket.data.username = username;
    console.log(socket.data.username);
  });
});



// Iniciando o servidor 
server.listen(PORT, () => {
  console.log(`Servidor HTTP está sendo executado na porta ${PORT}`);

});
