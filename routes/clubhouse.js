const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');
const bouncer_controller = require('../controllers/bouncerController');

// index
router.get('/', login_controller.index);

// bouncer awaiting secret password
router.get('/bouncer', bouncer_controller.bouncer);

router.post('/bouncer/become-member', bouncer_controller.become_member);

module.exports = router;
