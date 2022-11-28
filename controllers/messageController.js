const { body, validationResult } = require('express-validator');
const async = require('async');
const Message = require('../models/message');

exports.message_list_get = (req, res, next) => {
  Message.find({})
    .populate('msg_author')
    .sort({ msg_timestamp: 1 })
    .exec(function (err, list_messages) {
      if (err) {
        return next(err);
      }

      res.render('message_board', {
        user: req.user,
        message_list: list_messages,
      });
    });
};

exports.create_message_get = (req, res) => {
  if (req.user) {
    res.render('create_message', { user: req.user });
  } else {
    res.render('unauthorized_user');
  }
};

exports.create_message_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('message', 'Message must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const msg = new Message({
      msg_title: req.body.title,
      msg_text: req.body.message,
      msg_timestamp: Date.now(),
      msg_author: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render('create_message', {
        msg,
        errors: errors.array(),
      });
      return;
    }

    msg.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/');
    });
  },
];
