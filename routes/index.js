import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const express = require('express');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// for app and user files
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

// for auth file
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// for the file controller
router.post('/files', FilesController.postUpload);
router.post('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

module.exports = router;
