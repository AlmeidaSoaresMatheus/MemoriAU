const express = require('express');
const router = express.Router();
const multer = require('./multer');
const path = require('path');

const apiUsersController = require('./controller/apiUsersController.js');
const apiPetsController = require('./controller/apiPetsController.js');
const apiS3Controller = require('./controller/apiS3Controller.js');
const apiTimeline = require('./controller/apiTimelineController.js');
const authMiddleware = require('./middleware/authMiddleware');

//ROTAS BACKEND
router.get('/users', apiUsersController.findAll);
router.post('/users', apiUsersController.create);
router.post('/users/verifyLogin', apiUsersController.verifyLogin);
router.get('/users/recoverPassword', apiUsersController.recoverPassword);
router.post('/users/resetPassword', apiUsersController.resetPassword);
router.post('/users/logout', apiUsersController.logout);
router.get('/timeline/searchTimeline', apiTimeline.findFilesAndRecords);


//ROTAS PROTEGIDAS POR MIDDLEWARE
router.post('/pets', authMiddleware, apiPetsController.create);
router.get('/pets', authMiddleware, apiPetsController.findAll);
router.get('/pets/find', authMiddleware, apiPetsController.find);
router.get('/file/findFile', authMiddleware, apiS3Controller.findFiles);
router.get('/file/findFileRecord', authMiddleware, apiS3Controller.findFileRecord);
router.post('/file/upload', authMiddleware, multer.single('image'), apiS3Controller.upload);
router.delete('/file/delete', authMiddleware, apiS3Controller.delete)
router.post('/file/uploadprofilePetImage', authMiddleware, multer.single('image'), apiS3Controller.uploadprofilePetImage);
router.get('/timeline/searchTimeline', authMiddleware,  apiTimeline.findFilesAndRecords);
router.put('/pets/:idAnimal', authMiddleware, apiPetsController.edit);
router.put('/file/editMemory', authMiddleware, multer.single('image'), apiS3Controller.editMemory);
router.put('/users/update', authMiddleware, apiUsersController.update);

module.exports = router;

//ROTAS FRONTEND

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../memoriau-frontend-main/login/login.html'));
});

router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;