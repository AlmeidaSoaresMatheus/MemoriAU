const { findAll, verifyLogin } = require('../controller/apiUsersController');
const db = require('../db');
const bcrypt = require('bcrypt');

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
            const saltRounds = 10;
    
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                const sql = 'INSERT INTO user (email, name, password) VALUES (?, ?, ?)';
    
                db.query(sql, [email, name, hashedPassword], (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
    
                    const newUser = { email, name, password: hashedPassword };
                    resolve(newUser);
                });
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

    verifyLogin: (email, password) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                if (results.length === 0) {
                    resolve("Error");  
                }
    
                const user = results[0];
    
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    if (!isMatch) {
                        resolve("Error");  
                    }
                    resolve(user);  
                });
            });
        });
    }
};