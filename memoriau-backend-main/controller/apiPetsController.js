const petService = require('../service/apiPetService');

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = {pets: [] };

            const idLogin = req.query.idLogin;

            if (!idLogin) {
                return res.status(400).json({ error: 'idLogin é necessário.' });
            }

            let pets = await petService.findAll(idLogin);

            for (let pet in pets) {
                json.pets.push({
                    idLogin: pets[pet].idLogin,
                    name: pets[pet].nome,
                    breed: pets[pet].raca,
                    size: pets[pet].porte,
                    color: pets[pet].cor,
                    Sex: pets[pet].sexo,
                    Birth: pets[pet].nascimento,
                    Death: pets[pet].falecimento
                });
            }
            res.json(json);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel retornar os pets.' });
        }
    }, 

    createPet: async (req, res) => {
        try {
            const {idLogin, name, breed, size, color, sex, birth, death} = req.body;

            if (!idLogin || !name || !breed || !size || !color || !sex || !birth || !death) {
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const newPet = await petService.createPet(idLogin, name, breed, size, color, sex, birth, death);

            res.status(201).json(newPet);
        } catch (error) {
            console.error('Erro ao cadastrar pet:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o pet.' });
        }
    }
};
