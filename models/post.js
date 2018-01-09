const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  content: {type: String, required: true},
  date: {type: String, required:true},
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  like_count: {type: Number, required:false, default: 0},
  dislike_count: {type: Number, required:false, default: 0}
});

const Post = module.exports = mongoose.model('Post', PostSchema);
