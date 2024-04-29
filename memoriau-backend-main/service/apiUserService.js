const { findAll } = require('../controller/apiUsersController');
const db = require('../db');

module.exports = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM usuario', (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }, 

    createUser: (nameUser, login, password) => {
        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO usuario (nomeUsuario, login, senha) VALUES (?, ?, ?)';
            
            db.query(sql, [nameUser, login, password], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                const userId = result.insertId;

                const newUser = { idLogin: userId, nameUser, login, password };

                resolve(newUser);
            });
        });
    }
};
