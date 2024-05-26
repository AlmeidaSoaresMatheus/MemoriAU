const express = require('express');
const router = express.Router();
const multer = require('./multer');

const apiUsersController = require('./controller/apiUsersController.js');
const apiPetsController = require('./controller/apiPetsController.js');
const apiS3Controller = require('./controller/apiS3Controller.js');


router.get('/users', apiUsersController.findAll);
router.post('/users', apiUsersController.create);
router.get('/pets', apiPetsController.findAll);
router.post('/pets', apiPetsController.create);
router.post('/pets/delete', apiPetsController.delete);
router.get('/file/findFile', apiS3Controller.findFiles);
router.get('/file/findFileRecord', apiS3Controller.findFileRecord);
router.post('/users/verifyLogin', apiUsersController.verifyLogin);
router.post('/file/uploadImage', multer.single('image'), apiS3Controller.upload);

module.exports = router;