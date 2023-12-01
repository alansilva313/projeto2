// rabbitMQConsumerLog.js
const amqp = require('amqplib');
const prisma = require('../src/Client/PrismaClient');
const { rabbitMQURL, logQueue } = require('./rabbitmq.config');

async function consumeLogMessage(io) {
  try {
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(logQueue, { durable: true });
    console.log('Consumidor de log aguardando mensagens. Para sair pressione CTRL+C');

    channel.consume(logQueue, async (msg) => {
      if (msg !== null) {
        const logData = JSON.parse(msg.content.toString());
        console.log('Mensagem de log recebida:', logData);

        // Insira os dados do log no banco de dados
        const dadosLog = await prisma.log.create({
          data: logData,
        });

        // Emita um evento para todos os usuários conectados
        if (io) {
          io.emit('novaMensagemLog', { message: 'Nova mensagem de log criada!', logData: dadosLog });
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor de log:', error);
  }
}

module.exports = consumeLogMessage;
