const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  datePosted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  photo: { type: String },
  participants: { type: Number, required: true },
  verified: { type: Number, default: 0}
});

module.exports = mongoose.model('Post', PostSchema);
