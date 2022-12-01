const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const User = require('../models/user');

exports.bouncer = (req, res) => {
  res.render('bouncer', { user: req.user });
};

exports.become_member = [
  body('secretPassword')
    .custom((value, { req }) => {
      if (value != `${env.MEMBER_PASSWORD}`) {
        throw new Error('Wrong password');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('bouncer', {
        user: req.user,
        errors: errors.array(),
      });
      return;
    }

    User.findByIdAndUpdate(
      req.user._id,
      { membership_status: 'MEMBER' },
      (err, result) => {
        if (err) {
          return next(err);
        }
        res.redirect(result.url);
      }
    );
  },
];
