const mongoose = require('mongoose');

const PostUserSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: Number, default: 0}
});

module.exports = mongoose.model('PostUser', PostUserSchema);
