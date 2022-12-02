const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now },
  favorite_color: { type: String, required: true, default: '#1c5361' },
  membership_status: {
    type: String,
    required: true,
    enum: ['NEW', 'MEMBER'],
    default: 'NEW',
  },
  admin: { type: Boolean, required: true, default: false },
});

UserSchema.virtual('url').get(function () {
  return `/clubhouse/user/${this._id}`;
});

UserSchema.virtual('joined_formatted').get(function () {
  return DateTime.fromJSDate(this.joined).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model('User', UserSchema);
