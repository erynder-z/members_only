const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  joined: { type: Date, required: true, default: Date.now },
  membership_status: {
    type: String,
    required: true,
    enum: ['NEW', 'MEMBER'],
    default: 'NEW',
  },
  admin: { type: Boolean, required: true, default: false },
});

// Virtual for users's URL
UserSchema.virtual('url').get(function () {
  return `/clubhouse/user/${this._id}`;
});

// Export model
module.exports = mongoose.model('User', UserSchema);
