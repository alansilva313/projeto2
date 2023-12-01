const { publishLogMessage } = require('../rabitmq/filaLog'); // Importe a função de envio para a fila

// Seu controlador de log
module.exports = class LogController {
  static async logSearch(req, res) {
    const { busca, user_busca } = req.body;

    try {
      // Crie um objeto com os dados do log
      const log = {
        busca: busca,
        user_busca: user_busca,
      };

      // Envia o log para a fila RabbitMQ
      publishLogMessage(log);

      return res.status(200).json({ message: 'Log de pesquisa registrado com sucesso!', success: true });
    } catch (error) {
      console.error('Erro ao enviar log para a fila RabbitMQ:', error);
      return res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde!', success: false });
    }
  }
};
