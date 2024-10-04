const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { tokenCheck } = require("./functions");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }); // ovo se koristi u post-u tamo gore

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


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
router.post('/newpost', upload.array("photos", 10), async (req, res) => {
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    if (decoded.isOrg === 1){
      const { title, date, description, participants } = req.body;
      const photos = req.files.map(file => file.path);
      const newPost = new Post({ title, date, description, photos, participants });
      await newPost.save();
      const updated = await User.findByIdAndUpdate(decoded.userId,
        { $push: {events: newPost._id}},
        { new: true });
      if (!updated){
        return res.status(404).send("User not found");
      }
      res.status(201).json(newPost);
    }
    else{
      res.status(403).json({});
    }
  }
});

module.exports = router;
