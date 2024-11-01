const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const PostUser = require('../models/PostUser');
const { tokenCheck } = require("./functions");

const router = express.Router();


router.post("/makepostuser/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    const exists = await PostUser.findOne({postId: post_id, userId: decoded.userId});
    if (!exists){
      const newPostUser = new PostUser({
        postId: post_id,
        userId: decoded.userId,
        status: 1});
      newPostUser.save();
      res.status(200);
    }
    else{
        res.status(400);
    }
  }
});


router.get("/geteventvolonters", async (req, res) => {
  const { post_id, status } = req.query;
  const q_ans = await PostUser.find({postId: post_id, status: status});
  const volonters = [];
  for (const pu of q_ans){
    volonters.push(await User.findById(pu.userId));
  }
  res.json(volonters);
});


router.get("/getpostswithstatus", async (req, res) => {
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    const q_ans = await PostUser.find({userId: decoded.userId});
    const posts = [];
    for (const pu of q_ans){
        const elm = await PostUser.findById(pu.postId);
        // status parameter is added to the usuall post object
        elm.status = pu.status;
        posts.push(elm);
    }
    res.json(elm);
  }
});


router.post("/postuserchangestate", async (req, res) => {
  const post_id = req.body.post_id;
  const newStatus = req.body.new_status;
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    const exists = await PostUser.findOne({postId: post_id, userId: decoded.userId});
    if (exists){
      const updatedDocument = await PostUser.findOneAndUpdate(
        {postId: post_id, userId: decoded.userId}, // Query to match document
        {$set: {status: newStatus}},              // Update operation
        {new: true, runValidators: true}                       // Options: return updated doc and run validation
      );
      if (!updatedDocument){
        return res.status(404).json('Failed to find and update');
      }
      res.status(200).json("Updated");
    }
    else{
      res.status(404).json("Document doesn't exist");
    }
  }
  else{
    res.status(401).json("No logged in user");
  }
});

module.exports = router;
