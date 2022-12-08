const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const async = require('async');
const User = require('../models/user');
const Message = require('../models/message');

exports.user_page = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        shown_user(callback) {
          User.findById(req.params.id).exec(callback);
        },
        users_messages(callback) {
          Message.find({ msg_author: req.params.id })
            .populate('msg_author')
            .sort({ msg_timestamp: -1 })
            .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.shown_user == null) {
          const err = new Error('User not found');
          err.status = 404;
          return next(err);
        }
        res.render('userpage', {
          user: req.user,
          shown_user: results.shown_user,
          users_messages: results.users_messages,
        });
      }
    );
  } else {
    res.render('unauthorized_user');
  }
};

exports.become_admin_get = (req, res) => {
  if (req.user) {
    res.render('admin', {
      user: req.user,
    });
  }
};

exports.become_admin_post = [
  body('adminPassword')
    .custom((value, { req }) => {
      if (value != `${env.ADMIN_PASSWORD}`) {
        throw new Error('Wrong password');
      }
      return true;
    })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('admin', {
        user: req.user,
        errors: errors.array(),
      });
      return;
    }

    User.findByIdAndUpdate(req.user._id, { admin: true }, (err, result) => {
      if (err) {
        return next(err);
      }
      res.redirect(result.url);
    });
  },
];
