const amqp = require('amqplib');
const prisma = require('../src/Client/PrismaClient');

const { rabbitMQURL, logQueue } = require('../rabitmq/rabitserver');

async function consumeLogMessage() {
  try {
    const connection = await amqp.connect(rabbitMQURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(logQueue, { durable: true });
    console.log('Consumidor aguardando mensagens. Para sair pressione CTRL+C');

    channel.consume(logQueue, async (msg) => {
      if (msg !== null) {
        const logData = JSON.parse(msg.content.toString());
        console.log('Mensagem recebida para log:', logData);

        // Insira os dados do log no banco de dados
        const dadosServer = await prisma.log.create({
          data: logData,
        });
          
        console.log(dadosServer)
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro no consumidor de log:', error);
  }
}

module.exports = consumeLogMessage;


