// rabbitmq.js
const amqp = require('amqplib');
const { rabbitMQURL, animeQueue } = require('./rabbitmq.config');
const serverWebSocket = require('../websocket/serverwebsocket');

let channel;

async function setupRabbitMQ() {
  try {
    if (channel) {
      return channel;
    }

    const connection = await amqp.connect(rabbitMQURL);
    channel = await connection.createChannel();

    // Cria uma fila durável
    await channel.assertQueue(animeQueue, { durable: true });

    console.log(`Fila ${animeQueue} criada com sucesso.`);

    return channel;
  } catch (error) {
    console.error('Erro ao configurar a conexão RabbitMQ:', error);
    throw error;
  }
}

async function publishAnimeMessage(animeDataC, callback) {
  try {
    const currentChannel = await setupRabbitMQ();

    // Publica a mensagem na fila
    await currentChannel.sendToQueue(animeQueue, Buffer.from(JSON.stringify(animeDataC)), { persistent: true });

    console.log('Mensagem sobre a criação de um anime publicada com sucesso:', animeDataC);

    // Verifica se 'serverWebSocket' e 'serverWebSocket.io' estão definidos antes de chamar 'emit'
    if (serverWebSocket && serverWebSocket.io) {
      serverWebSocket.io.emit('novoAnime', animeDataC);
    } else {
      console.error('O objeto serverWebSocket ou serverWebSocket.io não está definido.');
    }

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error('Erro ao publicar mensagem sobre a criação de um anime no RabbitMQ:', error);
  }
}

module.exports = { setupRabbitMQ, publishAnimeMessage };
