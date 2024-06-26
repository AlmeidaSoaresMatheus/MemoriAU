const userService = require('../service/apiUserService');

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = {users: [] };

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
                    email:users[i].email
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

            if (findUser.length  !== 0) {
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

            if (verifyLogin  === "Error") {
                return res.status(400).json({ error: 'credenciais incorretas.' });
            }

            res.status(201).json(verifyLogin);
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            res.status(500).json({ error: 'Erro ao verificar as credenciais.' });
        }
    }

};