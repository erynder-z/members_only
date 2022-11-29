const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  msg_title: { type: String, required: true },
  msg_text: { type: String, required: true },
  msg_timestamp: { type: Date, required: true, default: Date.now },
  msg_author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  msg_reactions: {
    reacted_users: [Schema.Types.ObjectId],
    very_satisfied: {
      type: Number,
      required: true,
      default: 0,
    },
    satisfied: {
      type: Number,
      required: true,
      default: 0,
    },
    neutral: {
      type: Number,
      required: true,
      default: 0,
    },
    dissatisfied: {
      type: Number,
      required: true,
      default: 0,
    },
    very_dissatisfied: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

// Virtual for message's URL
MessageSchema.virtual('url').get(function () {
  return `/clubhouse/message/${this._id}`;
});

// Virtual for formatting the date
MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.msg_timestamp).toLocaleString(
    DateTime.DATE_MED
  );
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);
