const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  commentbody: String,
  date_added: {
    type: Date,
    default: Date.now
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
