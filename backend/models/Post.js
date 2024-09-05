const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  photo: { type: String },
  participants: { type: Number, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
