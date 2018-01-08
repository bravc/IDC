const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = Schema({
  name: {type: String, required: true},
  content: {type: String, required: true}
});

const Post = module.exports = mongoose.model('Post', PostSchema);
