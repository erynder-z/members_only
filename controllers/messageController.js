const { body, validationResult } = require('express-validator');
const async = require('async');
const Message = require('../models/message');
const Filter = require('bad-words');

const filter = new Filter();
const badwordsArray = require('badwords/array');
filter.addWords(...badwordsArray);

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

    const user = req.user;
    const msg = new Message({
      msg_title: filter.clean(req.body.title),
      msg_text: filter.clean(req.body.message),
      msg_timestamp: Date.now(),
      msg_author: user._id,
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

exports.option_very_satisfied_post = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error('Message not found');
          err.status = 404;
          return next(err);
        }
        // only allow reacting if user hasn't already reacted to message
        if (
          results.message.msg_reactions.reacted_users.find((el) =>
            el._id.equals(req.user._id)
          )
        ) {
          res.redirect('/clubhouse/message_board');
        } else {
          Message.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'msg_reactions.very_satisfied': 1 },
              $addToSet: { 'msg_reactions.reacted_users': req.user._id },
            },
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/clubhouse/message_board');
              }
            }
          );
        }
      }
    );
  }
};

exports.option_satisfied_post = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error('Message not found');
          err.status = 404;
          return next(err);
        }

        if (
          results.message.msg_reactions.reacted_users.find((el) =>
            el._id.equals(req.user._id)
          )
        ) {
          res.redirect('/clubhouse/message_board');
        } else {
          Message.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'msg_reactions.satisfied': 1 },
              $addToSet: { 'msg_reactions.reacted_users': req.user._id },
            },
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/clubhouse/message_board');
              }
            }
          );
        }
      }
    );
  }
};

exports.option_neutral_post = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error('Message not found');
          err.status = 404;
          return next(err);
        }

        if (
          results.message.msg_reactions.reacted_users.find((el) =>
            el._id.equals(req.user._id)
          )
        ) {
          res.redirect('/clubhouse/message_board');
        } else {
          Message.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'msg_reactions.neutral': 1 },
              $addToSet: { 'msg_reactions.reacted_users': req.user._id },
            },
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/clubhouse/message_board');
              }
            }
          );
        }
      }
    );
  }
};

exports.option_dissatisfied_post = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error('Message not found');
          err.status = 404;
          return next(err);
        }

        if (
          results.message.msg_reactions.reacted_users.find((el) =>
            el._id.equals(req.user._id)
          )
        ) {
          res.redirect('/clubhouse/message_board');
        } else {
          Message.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'msg_reactions.dissatisfied': 1 },
              $addToSet: { 'msg_reactions.reacted_users': req.user._id },
            },
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/clubhouse/message_board');
              }
            }
          );
        }
      }
    );
  }
};

exports.option_very_dissatisfied_post = (req, res) => {
  if (req.user) {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          const err = new Error('Message not found');
          err.status = 404;
          return next(err);
        }

        if (
          results.message.msg_reactions.reacted_users.find((el) =>
            el._id.equals(req.user._id)
          )
        ) {
          res.redirect('/clubhouse/message_board');
        } else {
          Message.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'msg_reactions.very_dissatisfied': 1 },
              $addToSet: { 'msg_reactions.reacted_users': req.user._id },
            },
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/clubhouse/message_board');
              }
            }
          );
        }
      }
    );
  }
};
