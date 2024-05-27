const { findAll } = require('../controller/apiTimelineController');
const db = require('../db');

module.exports = {
    findFileRecord: (email, nameAnimal) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM file WHERE email = ? AND nameAnimal = ?', [email, nameAnimal], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
}