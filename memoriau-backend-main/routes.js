const express = require('express');
const router = express.Router();

const apiUsersController = require('./controller/apiUsersController.js');
const apiPetsController = require('./controller/apiPetsController.js');


router.get('/users', apiUsersController.findAll);
router.post('/users', apiUsersController.createUser);
router.get('/pets', apiPetsController.findAll);
router.post('/pets', apiPetsController.createPet);


module.exports = router;