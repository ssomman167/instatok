const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  name: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  likes:{type:[String],default:[]},
  comments:{type:[String],default:[]}
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
