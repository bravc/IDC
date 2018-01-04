const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {type: String, required: true},
  profile: {type: JSON, required: true},
});

const User = module.exports = mongoose.model('User', UserSchema);
