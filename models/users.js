const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {type: String, required: true},
  profile: {type: JSON, required: true},
  profilePic: {type: String, required: false},
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post', required:false}]

});

const User = module.exports = mongoose.model('User', UserSchema);
