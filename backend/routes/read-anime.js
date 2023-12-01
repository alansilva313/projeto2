const router = require('express').Router();
const ReadAnimeController = require('../controllers/ReadAnimeController')
const jwt = require("jsonwebtoken")
const { createClient } = require('redis');
const client = createClient();
require("dotenv").config();



client.on('error', err => console.log('Redis Client Error', err));


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


async function iniciarRotaCache(){

    router.get('/readAnime/:userName', checkToken, ReadAnimeController.readAnime);
}

iniciarRotaCache()








module.exports = router
