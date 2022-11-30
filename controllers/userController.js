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
          Message.find({ msg_author: req.params.id }).exec(callback);
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
