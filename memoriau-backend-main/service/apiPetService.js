const { findAll } = require('../controller/apiPetsController');
const db = require('../db');

module.exports = {
    findAll: (idLogin) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM animal WHERE idLogin = ?', [idLogin], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 

    createPet: (idLogin, name, breed, size, color, sex, birth, death) => {
        return new Promise((resolve, reject) => {
    
            const sql = 'INSERT INTO animal (idLogin, nome, raça, porte, cor, sexo, nascimento, falecimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [idLogin, name, breed, size, color, sex, birth, death], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const petId = result.insertId;
    
                const newPet = { idAnimal: petId, name, breed, size, color, sex, birth, death };
    
                resolve(newPet);
            });
        });
    }    
};
