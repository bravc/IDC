const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  Name: {type: String, required: true},
  email: {type: String, required: true},
});

module.exports = mongoose.model('User', UserSchema);
