const express = require('express');
const router = express.Router();
const multer = require('./multer');
const path = require('path');

const apiUsersController = require('./controller/apiUsersController.js');
const apiPetsController = require('./controller/apiPetsController.js');
const apiS3Controller = require('./controller/apiS3Controller.js');
const apiTimeline = require('./controller/apiTimelineController.js');


//ROTAS BACKEND
router.get('/users', apiUsersController.findAll);
router.post('/users', apiUsersController.create);
router.get('/pets', apiPetsController.findAll);
router.post('/pets', apiPetsController.create);
router.get('/pets/find', apiPetsController.find);
router.get('/file/findFile', apiS3Controller.findFiles);
router.get('/file/findFileRecord', apiS3Controller.findFileRecord);
router.post('/users/verifyLogin', apiUsersController.verifyLogin);
router.post('/file/uploadImage', multer.single('image'), apiS3Controller.upload);
router.post('/file/uploadprofilePetImage', multer.single('image'), apiS3Controller.uploadprofilePetImage);
router.get('/timeline/searchTimeline', apiTimeline.findFilesAndRecords);
router.delete('/file/delete', apiS3Controller.delete)
module.exports = router;

//ROTAS FRONTEND

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../memoriau-frontend-main/login/login.html'));
});

router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;