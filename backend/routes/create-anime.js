// import o router do express e já inicializo ele
const router = require('express').Router();

// importo meu controller
const CreateAnimeController = require('../controllers/CreateAnimeController')

// crio minha rota que chama meu controller
router.post('/createAnime', CreateAnimeController.createAnime);

// realizo a exportação para chamar a rota no meu server.js
module.exports = router
