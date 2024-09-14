const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config(); 

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ email, password });
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

router.get("/admincheck", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token){
    res.json({ isOrg: 0 });
  }
  else{
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.isOrg === 1){
        res.json({ isOrg: 1});
      }
      else{
        res.json({ isOrg: 0 });
      }
    } catch (err){
      res.json({ isOrg: 0 });
    }
  }
})

module.exports = router;
