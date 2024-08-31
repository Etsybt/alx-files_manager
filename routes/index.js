const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

router.post('/users', UsersController.postNew);

module.exports = router;
