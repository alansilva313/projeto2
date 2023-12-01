// chamando meu arquivo Client para recuperar minhas models
const prisma = require('../src/Client/PrismaClient');

// chamando o redis
const redis = require('redis');

// inicializando o servidor redis
const client = redis.createClient();

// conectando ao servidor redis
client.connect();


// exportando minha classe
module.exports = class ReadUsersController {
  static async readAnime(req, res) {
    // recebendo o dado da pesquisa via parametro na url
    const userName = req.params.userName;

    try {
      // verificando se o paramtro foi passado corretamente
      if (!userName) {
        return res.status(400).json({ message: 'O parâmetro userName é obrigatório.', success: false });
      }
      
      // pegando os dados no redis através da chave armazenada
      const usersCad = await client.get(`readAnime:${userName}`);

      // convertendo para objeto
      const dadosCache = JSON.parse(usersCad);
      

      // se existir dados no cache, retorna os dados do cache
      if (dadosCache) {
        return res.status(200).json({ message: "Listagem de Animes", success: true, qtd: dadosCache.length, dadosCache});
      } else {

        // se não, realiza a leitura direto no banco
        const read = await prisma.anime.findMany({
          where: {
            nome: {
              startsWith: userName
            }
          },
          select: {
            id: true,
            nome: true,
            genero: true,
            quantidade_ep: true
          }
        });

        // e retorna os dados do banco mesmo
        res.status(200).json({ message: "Listagem de animes", success: true, qtd: read.length, read });

        
        // Depois realiza o armazenamento na chave do redis, para que na proxima consulta, os dados retornados sejam do cachê
        await client.set(`readAnime:${userName}`, JSON.stringify(read));
      }


      // caso aconteça algum erro, cai aqu no catch
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde!" });
    }
  }
};
