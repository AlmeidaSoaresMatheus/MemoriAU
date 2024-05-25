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

    create: (email, name, type, sex, birth, death) => {
        return new Promise((resolve, reject) => {
    
            const sql = 'INSERT INTO animal (email, name, type, sex, birth, death) VALUES (?, ?, ?, ?, ?, ?)';
            
            db.query(sql, [email, name, type, sex, birth, death], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                const petId = result.insertId;
    
                const newPet = {idAnimal: petId, email, name, type, sex, birth, death};
    
                resolve(newPet);
            });
        });
    },

    delete: (email, name) => {
        return new Promise((resolve, reject) => {
    
            const sql = 'DELETE FROM animal WHERE email = ? AND name = ?';
            
            db.query(sql, [email, name], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                resolve(result);
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