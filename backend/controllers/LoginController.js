

// chamando meu arquivo Client para recuperar minhas models
const prisma = require('../src/Client/PrismaClient');
// lib para geração de token
const jwt = require('jsonwebtoken');

// config do dotenv
require('dotenv').config();


// exporta minha classe
module.exports = class LoginController {
    static async login(req, res) {
        
        // recebendo os dados do corpo da requisição
        const { email, password } = req.body;
         
        // realizando a validação 
        if(!email || email === ""){
            res.status(400).json({message: "O email é obrigatorio!"})
            return;
        }

        if(!password || password === ""){
            res.status(400).json({message: "A senha é obrigatória!"})
            return;
        }




        // Procurar usuário no banco de dados pelo e-mail
        try{

            const user = await prisma.user.findFirst({
               
                where: {
                    email: email,
                    
                },

                select: {
                    name: true
                }
            });


            const busca = await prisma.user.findMany({
               select: {
                id: true,
                name: true
               }
            });
             
            // resgata minha chave única do .dotenv
            const secret = process.env.SECRET;

            // realiza a geração do token com o id do usuario do banco e o secret do .env
            const token = jwt.sign({
                id: busca.id,
            },

            secret,
            
            )

            

        // Verificar se o usuário existe e se a senha está correta
        if (user) {
            res.status(200).json({ message: "Autenticado com sucesso!", dados: user, tk: token, success: true});
        } else {
            res.status(401).json({ message: "Credenciais inválidas!", success: false});
            return;
        }
 


        // caso de algum erro cai no catch
        }catch(err){
            console.log(err)
            res.status(500).json("Aconteceu um erro no servidor, tente novamente!")
            return
        }
     

      
    }
};
