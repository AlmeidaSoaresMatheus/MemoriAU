const { findAll } = require('../controller/apiPetsController');
const db = require('../db');

module.exports = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM animal', (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 

    create: (nameLogin, name, breed, size, color, sex, birth, death) => {
        return new Promise((resolve, reject) => {
    
            const sql = 'INSERT INTO animal (nameLogin, name, breed, size, color, sex, birth, death) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [nameLogin, name, breed, size, color, sex, birth, death], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const petId = result.insertId;
    
                const newPet = { idAnimal: petId, name, breed, size, color, sex, birth, death };
    
                resolve(newPet);
            });
        });
    },
    
    find: (nameLogin) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM animal WHERE nameLogin = ?', [nameLogin], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 
};