const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
import AppController from '../controllers/AppController.js';

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);


module.exports = router;
