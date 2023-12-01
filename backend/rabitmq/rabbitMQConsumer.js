// rabbitMQConsumer.js
const amqp = require('amqplib');
const prisma = require('../src/Client/PrismaClient');
const { rabbitMQURL, animeQueue } = require('./rabbitmq.config');

async function consumeAnimeMessage(io) {
  try {
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(animeQueue, { durable: true });
    console.log('Consumidor aguardando mensagens. Para sair pressione CTRL+C');

    channel.consume(animeQueue, async (msg) => {
      if (msg !== null) {
        const animeDataC = JSON.parse(msg.content.toString());
        console.log('Mensagem recebida:', animeDataC);

        // Insira no banco de dados
        const dadosBanco = await prisma.anime.createMany({
          data: animeDataC
        });

        console.log(dadosBanco);

        // Emita um evento para todos os usuários conectados, exceto o que criou a mensagem
        if (io) {
          io.emit('novoAnime', { message: 'Novo anime criado!', animeData: dadosBanco });
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor:', error);
  }
}

module.exports = consumeAnimeMessage;
