const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  datePosted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  photos: { type: Array, default: [] },
  participants: { type: Number, required: true }
});

module.exports = mongoose.model('Post', PostSchema);
