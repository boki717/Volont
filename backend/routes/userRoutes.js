const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure this path is correct
const Post = require('../models/Post');
const PostUser = require('../models/PostUser');
const jwt = require('jsonwebtoken');
const { tokenCheck } = require("./functions");
require('dotenv').config();
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

const upload = multer({ storage: storage }); // ovo se koristi u post-u tamo gore

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


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
    try{
      const user = await User.findById(decoded.userId);
      res.json(user);
    }
    catch (err){
      res.json({});
    }
  }
});

router.get("/getuser/:id", async (req, res) => {
  const user_id = req.params.id;
  try{
    if (mongoose.Types.ObjectId.isValid(user_id)){
      const user = await User.findById(user_id);
      res.json(user);
    }
    else{
      res.json({});
    }
  }
  catch (err){
    res.json({});
  }
});


// make a route that will return all posts that user signed up for only based on token
router.get('/getUserPosts/:id', async (req, res) => {
  const user_id = req.params.id;
  try{
    if (!mongoose.Types.ObjectId.isValid(user_id)){
      res.json([]);
    }
    else{
      const posts = [];
      const user = await User.findById(user_id);
      for (const postId of user.events){
        posts.push(await Post.findById(postId));
      }
      posts.reverse();
      res.json(posts);
    }
  }
  catch (err){
    res.json([]);
  }
});


router.put("/updateUser", upload.single("photo"), async (req, res) => {
  const newUserData = req.body;
  if (req.file) newUserData.photo = req.file.path;
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    try{
      const updatedUser = await User.findByIdAndUpdate(newUserData._id,
      {$set: {
        name: newUserData.name,
        city: newUserData.city,
        description: newUserData.description,
        email: newUserData.email,
        phone: newUserData.phone,
        photo: newUserData.photo
      }},
      {new: true, runValidators: true});
    
      if (!updatedUser){
        res.json('Failed to find and update');  // maybe this can break things
      }
      else{
        res.status(200).json("Updated");
      }
    }
    catch (err){
      res.json("Query failed");
    }
  }
});

module.exports = router;
