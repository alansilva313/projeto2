const router = require('express').Router();
const LogController = require('../controllers/LogController')
const jwt = require("jsonwebtoken")


require("dotenv").config();

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




router.post('/logSearch', checkToken, LogController.logSearch);


module.exports = router
