const petService = require('../service/apiPetService');

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = {pets: [] };

            const nameLogin = req.query.nameLogin;

            let pets;

            if (!nameLogin) {
                pets = await petService.findAll();
            } else { 
                 pets = await petService.find(nameLogin);
            }

            for (let pet in pets) {
                json.pets.push({
                    nameLogin: pets[pet].nameLogin,
                    name: pets[pet].name,
                    breed: pets[pet].breed,
                    size: pets[pet].size,
                    color: pets[pet].color,
                    sex: pets[pet].sex,
                    birth: pets[pet].birth,
                    death: pets[pet].death
                });
            }
            res.json(json);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel retornar os pets.' });
        }
    }, 

    create: async (req, res) => {
        try {
            const {nameLogin, name, breed, size, color, sex, birth, death} = req.body;

            if (!nameLogin || !name || !breed || !size || !color || !sex || !birth || !death) {
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const newPet = await petService.create(nameLogin, name, breed, size, color, sex, birth, death);

            res.status(201).json(newPet);
        } catch (error) {
            console.error('Erro ao cadastrar pet:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o pet.' });
        }
    }
};