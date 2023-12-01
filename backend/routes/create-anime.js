// import o router do express e já inicializo ele
const router = require('express').Router();
const jwt = require('jsonwebtoken')
require("dotenv").config();
// importo meu controller
const CreateAnimeController = require('../controllers/CreateAnimeController')


// midlleware que faz a verificação e validação do token
function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Acesso negado!"});
        
    }


    try{

        const secret = process.env.SECRET;
        jwt.verify(token, secret);

        next();

    }catch(err){
        console.log(err);


        res.status(400).json({message: "Token inválido!"})
    }
}


// crio minha rota que chama meu controller
router.post('/createAnime', checkToken, CreateAnimeController.createAnime);

// realizo a exportação para chamar a rota no meu server.js
module.exports = router
