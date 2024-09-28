const express = require('express');
const Post = require('../models/Post');
const { tokenCheck } = require("./functions");
const jwt = require('jsonwebtoken');

const router = express.Router();

// Get All Posts
router.get('/posts/:page', async (req, res) => {
  const post_limit = 10;
  let on_page = 1;
  const pgstr = req.params.page
  if (/^\d+$/.test(pgstr)) on_page = parseInt(pgstr);
  const posts = await Post.find({}).sort({datePosted: -1}).skip(post_limit * (on_page - 1)).limit(post_limit);
  res.json(posts);
});

// get one post
router.get("/getpost/:id", async (req, res) => {
  const post_id = req.params.id;
  const post = await Post.findById(post_id);
  res.json(post);
});

// Create a New Post
router.post('/newpost', async (req, res) => {
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    if (decoded.isOrg === 1){
      const { title, date, description, photo, participants } = req.body;
      const newPost = new Post({ title, date, description, photo, participants });
      await newPost.save();
      res.status(201).json(newPost);
    }
    else{
      res.status(403).json({});
    }
  }
});

module.exports = router;
