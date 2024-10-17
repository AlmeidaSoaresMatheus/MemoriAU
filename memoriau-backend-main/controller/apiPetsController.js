const petService = require('../service/apiPetService');
const apiS3Controller = require('../controller/apiS3Controller')

module.exports = {
    findAll: async (req, res) => {
        try {
            let json = { pets: [] };

            let pets;

            const email = req.query.email;

            if (!email) {
                pets = await petService.findAll();
            } else {
                pets = await petService.find(email);
            }

            for (let pet in pets) {
                json.pets.push({
                    email: pets[pet].email,
                    name: pets[pet].name,
                    type: pets[pet].type,
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
            const { email, name, type, sex, birth, death, isAlive } = req.body;

            let deathValue = isAlive ? null : death;

            if (!email || !name || !type || !sex || !birth) {
                return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
            }

            const newPet = await petService.create(email, name, type, sex, birth, deathValue, isAlive);

            res.status(201).json(newPet);
        } catch (error) {
            console.error('Erro ao cadastrar pet:', error);
            res.status(500).json({ error: 'Erro ao cadastrar o pet.' });
        }
    },

    find: async (req, res) => {
        try {
            let json = { pets: [] };

            const email = req.query.email;

            let pets;

            if (!email) {
                return res.status(400).json({ error: 'Nao foi fornecido o email.' });
            }

            pets = await petService.find(email);

            for (let pet in pets) {
                json.pets.push({
                    idAnimal: pets[pet].idAnimal,
                    email: pets[pet].email,
                    name: pets[pet].name,
                    type: pets[pet].type,
                    sex: pets[pet].sex,
                    birth: pets[pet].birth,
                    death: pets[pet].death
                });
            }
            res.json(json);
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel retornar o pet.' });
        }
    },
    
    edit: async (req, res) => {
        try {
            const { idAnimal } = req.params;
            const { email, name, type, sex, birth, death, isAlive } = req.body;

            let deathValue = isAlive ? null : death;
            console.log(death); 
            if (!idAnimal) {
                return res.status(400).json({ error: 'O ID do animal é obrigatório.' });
            }

            if (!email || !name || !type || !sex || !birth) {
                return res.status(400).json({ error: 'Todos os campos são necessários.' });
            }

            const updatedPet = await petService.update(idAnimal, email, name, type, sex, birth, deathValue, isAlive);
        
            res.json({ message: 'Pet atualizado com sucesso.', pet: updatedPet });
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            res.status(500).json({ error: 'Nao foi possivel atualizar o pet.' });
        }
    },

};