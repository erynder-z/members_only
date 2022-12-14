const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/loginController');
const signup_controller = require('../controllers/signupController');

/* GET home page. */
router.get('/', function (req, res) {
  res.redirect('/clubhouse');
});

//login-logout
router.post('/log-in', login_controller.login_post);
router.post('/log-out', login_controller.logout_post);

// sign up
router.get('/sign-up', signup_controller.sign_up_get);
router.post('/sign-up', signup_controller.sign_up_post);

module.exports = router;
