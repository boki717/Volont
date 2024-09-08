const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Get All Posts
router.get('/posts/:page', async (req, res) => {
  const post_limit = 10;
  const on_page = 1;
  const pgstr = req.params.page
  // if (/^\d+$/.test(pgstr)) on_page = parseInt(pgstr);
  const posts = await Post.find({}).sort({date: -1}).skip(post_limit * (on_page - 1)).limit(post_limit);
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
