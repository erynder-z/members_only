const { body, validationResult } = require('express-validator');
const async = require('async');
const Message = require('../models/message');

exports.message_detail_get = (req, res) => {
  async.parallel(
    {
      msg(callback) {
        Message.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.msg == null) {
        const err = new Error(';essage not found');
        err.status = 404;
        return next(err);
      }
      res.render('message_detail', {
        user: req.user,
        msg: results.msg,
      });
    }
  );
};

exports.create_message_get = (req, res) => {
  res.render('create_message', { user: req.user });
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

      res.redirect(msg.url);
    });
  },
];
