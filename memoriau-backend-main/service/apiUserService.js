const { findAll } = require('../controller/apiUsersController');
const db = require('../db');

module.exports = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user', (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 

    create: (email, name, password) => {
        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO user (email, name, password) VALUES (?, ?, ?)';
            
            db.query(sql, [email, name, password], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                const newUser = {email, name, password};

                resolve(newUser);
            });
        });
    },

    find: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },
};