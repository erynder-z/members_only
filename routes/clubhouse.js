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

router.get('/admin', user_controller.become_admin_get);

router.post('/admin', user_controller.become_admin_post);

router.post('/bouncer/become-member', bouncer_controller.become_member);

router.get('/user/:id', user_controller.user_page);

router.get('/message_board', message_controller.message_list_get);

router.get('/create_message', message_controller.create_message_get);

router.post('/create_message', message_controller.create_message_post);

router.post('/delete_message/:id', message_controller.delete_message_post);

router.post(
  '/message/:id/very_satisfied',
  message_controller.option_very_satisfied_post
);

router.post('/message/:id/satisfied', message_controller.option_satisfied_post);

router.post('/message/:id/neutral', message_controller.option_neutral_post);

router.post(
  '/message/:id/dissatisfied',
  message_controller.option_dissatisfied_post
);

router.post(
  '/message/:id/very_dissatisfied',
  message_controller.option_very_dissatisfied_post
);

module.exports = router;
