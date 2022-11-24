const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.sign_up_get = (req, res) => res.render('sign-up-form');

exports.sign_up_post = (req, res, next) => {
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
  });
  // hash user password
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    // store hashedPassword in DB
    user.password = hashedPassword;
    user.save((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  });
};
