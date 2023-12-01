// rabbitMQConsumerAnime.js
const amqp = require('amqplib');
const prisma = require('../src/Client/PrismaClient');
const { rabbitMQURL, animeQueue } = require('./rabbitmq.config');

async function consumeAnimeMessage(io) {
  try {
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(animeQueue, { durable: true });
    console.log('Consumidor de anime aguardando mensagens. Para sair pressione CTRL+C');

    channel.consume(animeQueue, async (msg) => {
      if (msg !== null) {
        const animeDataC = JSON.parse(msg.content.toString());
        console.log('Mensagem de anime recebida:', animeDataC);

        // Insira os dados do anime no banco de dados
        const dadosAnime = await prisma.anime.create({
          data: animeDataC,
        });

        // Emita um evento para todos os usuários conectados
        if (io) {
          io.emit('novoAnime', { message: 'Nova mensagem de anime criada!', animeData: dadosAnime });
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor de anime:', error);
  }
}

module.exports = consumeAnimeMessage;
