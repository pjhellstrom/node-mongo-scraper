const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create new schema using Schema constructor
const PostSchema = new Schema(
  {
  title: String,
  body: String,
  url: String,
  image: String
  }
);

// Create Post model with PostSchema applied
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
