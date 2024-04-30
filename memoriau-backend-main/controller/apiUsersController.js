const userService = require('../service/apiUserService');

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = {users: [] };

            let users = await userService.findAll();

            for (let i in users) {
                json.users.push({
                    id: users[i].id,
                    login: users[i].login
                });
            }
            res.json(json);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel retornar os usuarios.' });
        }
    }, 

    createUser: async (req, res) => {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                console.log(nameUser)
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const newUser = await userService.createUser(login, password);

            res.status(201).json(newUser);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
        }
    }
};