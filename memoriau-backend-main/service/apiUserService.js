const { findAll, verifyLogin } = require('../controller/apiUsersController');
const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'variaveis.env' });

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
    },

    generateToken: () => {
        return Math.random().toString(36).substr(2);
    },

    resetToken: (email, token) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE user SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?';

            // 1hora
            const expirationDate = new Date(Date.now() + (10 * 60000) + (3 * 3600000));

            db.query(sql, [token, expirationDate, email], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            });
        });
    },

    sendEmail: async (email, resetLink) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  `${process.env.EMAIL_USER}`,
                pass:  `${process.env.EMAIL_PASSWORD}`
            }
        });

        const mailOptions = {
            from: 'memoriau.mail@gmail.com',
            to: email,
            subject: 'Recuperação de senha do MemoriAU',
            text: `Clique no link para recuperar sua senha: ${resetLink}`
        };

        try {
            const info = await transporter.sendMail(mailOptions);

            if (info.accepted.length) {
                return { success: 'Email de recuperação enviado.' };
            } else {
                return { error: 'Erro ao enviar o email de recuperação.' };
            }
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return { error: 'Erro ao enviar o email de recuperação.' };
        }
    },

    verifyResetToken: async (token) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM user WHERE resetToken = ? AND resetTokenExpiration > NOW()`;

            db.query(sql, [token], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
        });
    },

    updatePassword: async (token, newPassword) => {
        const saltRounds = 10;
    
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
        const sql = 'UPDATE user SET password = ? WHERE resetToken = ?';
    
        return new Promise((resolve, reject) => {
            db.query(sql, [hashedPassword, token], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                if (result.affectedRows === 0) {
                    reject(new Error('Usuário não encontrado'));
                    return;
                }
    
                resolve({ token, message: 'Senha atualizada com sucesso.' });
            });
        });
    },

    update: (email, name, password) => {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
    
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                const sql = 'UPDATE user SET name = ?, password = ? WHERE email = ?';
    
                db.query(sql, [name, hashedPassword, email], (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
    
                    if (result.affectedRows === 0) {
                        reject(new Error('Usuário não encontrado'));
                        return;
                    }
    
                    // Certifique-se de retornar o newEmail corretamente
                    resolve({ email, name });
                });
            });
        });
    }
};
