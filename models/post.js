const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  content: {type: String, required: true},
  date: {type: String, required:true}
});

const Post = module.exports = mongoose.model('Post', PostSchema);
