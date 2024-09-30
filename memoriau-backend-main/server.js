require('dotenv').config({path:'variaveis.env'});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({xtended: false}));

server.use(express.static(path.join(__dirname, '../memoriau-frontend-main')));

server.use('/api', routes);
server.use(routes);

server.listen(process.env.PORT, ()=> {
    console.log(`Servidor rodando em: ${process.env.URL_DOMAIN}${process.env.PORT}`);
})