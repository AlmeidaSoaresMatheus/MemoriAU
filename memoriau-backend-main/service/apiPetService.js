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

    create: (email, name, breed, size, color, sex, birth, death) => {
        return new Promise((resolve, reject) => {
    
            const sql = 'INSERT INTO animal (email, name, breed, size, color, sex, birth, death) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [email, name, breed, size, color, sex, birth, death], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const petId = result.insertId;
    
                const newPet = {idAnimal: petId, email, name, breed, size, color, sex, birth, death};
    
                resolve(newPet);
            });
        });
    },
    
    find: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM animal WHERE email = ?', [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 
};