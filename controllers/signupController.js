const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.sign_up_get = (req, res) => res.render('sign-up-form');

exports.sign_up_post = [
  // Validation and sanatation
  body('first_name', 'First name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    'password',
    'Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
  )
    .trim()
    .isStrongPassword() // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    .escape(),
  body('confirmPassword', 'Passwords do not match.').custom(
    (value, { req }) => value === req.body.password
  ),

  (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('sign-up-form', {
        user,
        errors: errors.array(),
      });
      return;
    }

    // hash user password
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      // store hashedPassword in DB
      user.password = hashedPassword;
      user.save((err) => {
        if (err) return next(err);
        // login user directly after sign-up
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      });
    });
  },
];
