const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Get All Posts
router.get('/posts/:page', async (req, res) => {
  const post_limit = 10;
  let on_page = 1;
  const pgstr = req.params.page
  if (/^\d+$/.test(pgstr)) on_page = parseInt(pgstr);
  const posts = await Post.find({}).sort({datePosted: -1}).skip(post_limit * (on_page - 1)).limit(post_limit);
  res.json(posts);
});

// Create a New Post
router.post('/newpost', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token){
    res.status(401).json({});
  }
  else{
    try{
      console.log("hello I am in here meaning that the token exists:");
      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("token jeste validan");
      if (decoded.isOrg === 1){
        console.log(req.body);
        const { title, date, description, photo, participants } = req.body;
        const newPost = new Post({ title, date, description, photo, participants });
        await newPost.save();
        console.log("saved new post");
        res.status(201).json(newPost);
      }
      else{
        console.log("nisi organizacija bajo");
        res.status(403).json({});
      }
    } catch (err){
      res.status(400).json({});
    }
  }
});

module.exports = router;
