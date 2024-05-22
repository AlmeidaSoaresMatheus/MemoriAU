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
                res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const findUser = await userService.find(email);

            if (findUser.length  !== 0) {
                res.status(400).json({ error: 'login ja existe no banco' });
            }

            const newUser = await userService.create(email, name, password);

            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
        }
    }
};