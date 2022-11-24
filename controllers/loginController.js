const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const passport = require('passport');

exports.index = (req, res) => {
  res.render('index', { user: req.user, message: req.flash('error') });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true,
});

exports.logout_post = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
