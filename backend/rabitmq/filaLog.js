// rabbitmq.js
const amqp = require('amqplib');
const { rabbitMQURL, logQueue } = require('./rabbitmq.config');

let channel;

async function setupRabbitMQ() {
  try {
    if (channel) {
      return channel;
    }

    const connection = await amqp.connect(rabbitMQURL);
    channel = await connection.createChannel();

    // Cria uma fila durável
    await channel.assertQueue(logQueue, { durable: true });

    console.log(`Fila ${logQueue} criada com sucesso.`);

    return channel;
  } catch (error) {
    console.error(`Erro ao configurar a conexão RabbitMQ para a fila ${logQueue}:`, error);
    throw error;
  }
}

async function publishLogMessage(message, callback) {
  try {
    const currentChannel = await setupRabbitMQ();

    // Publica a mensagem na fila
    await currentChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`Mensagem publicada com sucesso na fila ${logQueue}:`, message);

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error(`Erro ao publicar mensagem na fila ${logQueue} no RabbitMQ:`, error);
  }
}

module.exports = { setupRabbitMQ, publishLogMessage };
