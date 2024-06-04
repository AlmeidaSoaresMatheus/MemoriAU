const express = require('express');
const router = express.Router();
const multer = require('./multer');

const apiUsersController = require('./controller/apiUsersController.js');
const apiPetsController = require('./controller/apiPetsController.js');
const apiS3Controller = require('./controller/apiS3Controller.js');
const apiTimeline = require('./controller/apiTimelineController.js');


router.get('/users', apiUsersController.findAll);
router.post('/users', apiUsersController.create);
router.get('/pets', apiPetsController.findAll);
router.post('/pets', apiPetsController.create);
router.get('/pets/find', apiPetsController.find);
router.post('/pets/delete', apiPetsController.delete);
router.get('/file/findFile', apiS3Controller.findFiles);
router.get('/file/findFileRecord', apiS3Controller.findFileRecord);
router.post('/users/verifyLogin', apiUsersController.verifyLogin);
router.post('/file/uploadImage', multer.single('image'), apiS3Controller.upload);
router.post('/file/uploadprofilePetImage', multer.single('image'), apiS3Controller.uploadprofilePetImage);
router.get('/timeline/searchTimeline', apiTimeline.findFilesAndRecords);
router.delete('/file/delete', apiS3Controller.delete)
module.exports = router;