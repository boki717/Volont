const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Get All Posts
router.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Create a New Post
router.post('/newpost', async (req, res) => {
  const { title, date, description, photo, participants } = req.body;
  const newPost = new Post({ title, date, description, photo, participants });

  await newPost.save();
  res.status(201).json(newPost);
});

module.exports = router;
