const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');
const bouncer_controller = require('../controllers/bouncerController');
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

// index
router.get('/', login_controller.index);

// bouncer awaiting secret password
router.get('/bouncer', bouncer_controller.bouncer);

router.post('/bouncer/become-member', bouncer_controller.become_member);

router.get('/user/:id', user_controller.user_page);

router.get('/message_board', message_controller.message_list_get);

router.get('/create_message', message_controller.create_message_get);

router.post('/create_message', message_controller.create_message_post);

module.exports = router;
