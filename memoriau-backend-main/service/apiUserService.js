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

    createUser: (login, password) => {
        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO user (login, password) VALUES (?, ?)';
            
            db.query(sql, [login, password], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                const newUser = {login, password};

                resolve(newUser);
            });
        });
    }
};
