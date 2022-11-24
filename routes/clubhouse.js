const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');

// index
router.get('/', login_controller.index);

module.exports = router;
