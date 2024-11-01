const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const Post = require('../models/Post');
const PostUser = require('../models/PostUser');
const jwt = require('jsonwebtoken');
const { tokenCheck } = require("./functions");
require('dotenv').config();


const router = express.Router();


// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, isOrg: user.organization },
      process.env.JWT_SECRET, {expiresIn: "2h"});
    res.json({ token });  // treba token da se salje u stvari
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get("/orgcheck", async (req, res) => {
  const decoded = tokenCheck(req, res, { isOrg: 0});
  if (decoded){
    res.json({ isOrg: decoded.isOrg});
  }
});


router.get("/isloggedin", async (req, res) => {
  const decoded = tokenCheck(req, res, { isin: 0});
  if (decoded){
    res.json({ isin: 1});
  }
});

router.get("/getloggedinuser", async (req, res) => {
  const decoded = tokenCheck(req, res, { userData: {} });
  if (decoded){
    const user = await User.findById(decoded.userId);
    res.json(user);
  }
});

router.get("/getuser/:id", async (req, res) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id);
  res.json(user);
});


// make a rout that will return all posts that user signed up for only based on token
router.get('/getUserPosts/:id', async (req, res) => {
  const user_id = req.params.id;
  if (user_id.length != 24){
    res.json([]);
  }
  else{
    const posts = [];
    const user = await User.findById(user_id);
    for (const postId of user.events){
      posts.push(await Post.findById(postId));
    }
    res.json(posts);
  }
});

module.exports = router;
