const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  msg_title: { type: String, required: true },
  msg_text: { type: String, required: true },
  msg_timestamp: { type: Date, required: true },
  msg_author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Virtual for message's URL
MessageSchema.virtual('url').get(function () {
  return `/clubhouse/message/${this._id}`;
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);
