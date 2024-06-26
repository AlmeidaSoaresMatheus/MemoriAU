const { findAll, deleteMemory } = require('../controller/apiS3Controller');
const db = require('../db');

module.exports = {
    addFileRecord: (nameFile, nameAnimal, email, date, description) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO file (nameFile, nameAnimal, email, date, descriptionFile) VALUES (?, ?, ?, ?, ?)';
        
            db.query(sql, [nameFile, nameAnimal, email, date, description], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                const fileId = result.insertId;
                const newFile = {idFile: fileId, nameFile, nameAnimal, email, date, description};
                resolve(newFile);
            });
        });
    },

    findFileRecord: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM file WHERE email = ?', [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    deleteMemory: (email, petName, description) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM file WHERE email = ? AND nameAnimal = ? AND descriptionFile = ?', [email, petName, description], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    deletePet: (email, petName) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM file WHERE email = ? AND nameAnimal = ?', [email, petName], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },
};
