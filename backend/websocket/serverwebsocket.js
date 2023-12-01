const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const consumeAnimeMessage = require('../rabitmq/rabbitMQConsumer');

class ServerWebSocket {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: { origin: "http://localhost:3000" },
    });

    this.io.on("connection", (socket) => {
      console.log("Usuário conectado!", socket.id);

      socket.on("disconnect", (reason) => {
        console.log("Usuário desconectado!", socket.id);
      });

      socket.on("set_username", (username) => {
        socket.data.username = username;
        console.log(socket.data.username);
      });
    });

    // Integre o consumidor do anime passando a instância do io
    consumeAnimeMessage(this.io);
  }

  emit(event, data) {
    if (this.io && this.io.sockets) {
      this.io.sockets.emit(event, data);
    }
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Servidor WebSocket está ouvindo na porta ${port}`);
    });
  }
}

const serverWebSocket = new ServerWebSocket();
serverWebSocket.start(3005); // Escolha a porta que deseja usar
