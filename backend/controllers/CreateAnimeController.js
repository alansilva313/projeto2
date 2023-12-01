// CreateAnimeController.js
const { publishAnimeMessage } = require('../rabitmq/rabitserver');
const { handleServerError } = require('util'); // Substitua com sua lógica de tratamento de erro

module.exports = class CreateAnimeController {
  static async createAnime(req, res) {
    // resgato os dados da requisição
    const { nome, genero, quantidade_ep, socketId } = req.body;

    console.log("Este é o meu id do lado do cliente: " + socketId);

    try {
      // Validação dos campos
      if (!nome || !genero || !quantidade_ep) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios!", success: false });
      }

      // Criar uma mensagem com os dados do anime
      const animeDataC = {
        nome: nome,
        genero: genero,
        quantidade_ep: quantidade_ep
      };

      // Publicar a mensagem diretamente na fila RabbitMQ
      console.log('Publicando a mensagem');
      publishAnimeMessage(animeDataC, () => {
        console.log('Callback executado após a publicação do anime');
      });

      console.log('Dados publicados');

      return res.status(201).json({ message: "Anime criado com sucesso! Aguarde a confirmação.", success: true });
    } catch (error) {
      handleServerError(error, res);
    }
  }
};
