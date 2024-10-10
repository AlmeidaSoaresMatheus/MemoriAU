const { ProcessCredentials } = require('aws-sdk');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = authMiddleware;