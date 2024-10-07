const userService = require('../service/apiUserService');
require('dotenv').config({path:'variaveis.env'});
const nodemailer = require('nodemailer');

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = { users: [] };

            const email = req.query.email;

            let users;

            if (!email) {
                users = await userService.findAll();
            } else {
                users = await userService.find(email);
            }

            for (let i in users) {
                json.users.push({
                    name: users[i].name,
                    email: users[i].email
                });
            }
            res.json(json);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel retornar os usuarios.' });
        }
    },

    create: async (req, res) => {
        try {
            const { email, name, password } = req.body;

            if (!email || !name || !password) {
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const findUser = await userService.find(email);

            if (findUser.length !== 0) {
                return res.status(400).json({ error: 'login ja existe no banco' });
            }

            const newUser = await userService.create(email, name, password);

            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
        }
    },

    verifyLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const verifyLogin = await userService.verifyLogin(email, password);

            if (verifyLogin === "Error") {
                return res.status(400).json({ error: 'credenciais incorretas.' });
            }

            res.status(201).json(verifyLogin);
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            res.status(500).json({ error: 'Erro ao verificar as credenciais.' });
        }
    },

    recoverPassword: async (req, res) => {
        try {
            const { email } = req.query;   
                 
            if (!email) {
                return res.status(400).json({ error: 'Email não fornecido.' });
            }

            const findEmail = await userService.find(email);

            if (findEmail.length == 0) {
                return res.status(400).json({ error: 'Email não encontrado.' });
            }

            const token = await userService.generateToken();

            await userService.resetToken(email, token);

            const resetLink = `${process.env.URL_DOMAIN}recuperaSenha/recuperaSenha.html?token=${token}`;

            const emailResult = await userService.sendEmail(email, resetLink);

            if (emailResult.error) {
                return res.status(500).json({ error: 'Erro ao enviar o email de recuperação.' });
            }

            return res.status(200).json({ success: 'Email de recuperação enviado com sucesso.' });

        } catch (error) {
            console.error('Erro ao enviar email de recuperacao de senha:', error);
            res.status(500).json({ error: 'Erro ao enviar email de recuperacao de senha.' });
        }
    }, 

    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;

        try {
            const validToken = await userService.verifyResetToken(token);

            if (!validToken) {
                return res.status(401).json({ error: 'Token inválido.' });
            }

            const updateResponse = await userService.updatePassword(token, newPassword);

            res.status(200).json(updateResponse);
        } catch (error) {
            console.error('Erro ao alterar a senha:', error);
            res.status(500).json({ error: 'Erro ao alterar a senha.' });
        }
    }
};