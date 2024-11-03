const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const PostUser = require('../models/PostUser');
const { tokenCheck } = require("./functions");

const router = express.Router();


router.post("/makepostuser/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  try{
    if (mongoose.Types.ObjectId.isValid(post_id)){
      const decoded = tokenCheck(req, res, {});
      if (decoded){
        const exists = await PostUser.findOne({postId: post_id, userId: decoded.userId});
        if (!exists && decoded.isOrg === 0){
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
    }
    else{
      res.json({});
    }
  }
  catch (err){
    res.json({});
  }
});


router.get("/geteventvolonters", async (req, res) => {
  const { post_id, status } = req.query;
  try{
    if (mongoose.Types.ObjectId.isValid(post_id)){
      const q_ans = await PostUser.find({postId: post_id, status: status});
      const volonters = [];
      for (const pu of q_ans){
        volonters.push(await User.findById(pu.userId));
      }
      res.json(volonters);
    }
    else{
      res.json([]);
    }
  }
  catch (err){
    res.json([]);
  }
});


router.get("/getpostswithstatus", async (req, res) => {
  const decoded = tokenCheck(req, res, {});
  if (decoded){
    if (decoded.isOrg === 0){
      try{
        const q_ans = await PostUser.find({userId: decoded.userId});
        const posts = [];
        for (const pu of q_ans){
            const elm = await Post.findById(pu.postId).lean();
            // status parameter is added to the usuall post object
            elm.status = pu.status;
            posts.push(elm);
        }
        res.json(posts);
      }
      catch (err){
        res.json([]);
      }
    }
    else{
      res.json([]);
    }
  }
});


router.post("/postuserchangestate", async (req, res) => {
  const post_id = req.body.post_id;
  const user_id = req.body.user_id;
  try{
    if (mongoose.Types.ObjectId.isValid(user_id) && mongoose.Types.ObjectId.isValid(post_id)){
      const newStatus = req.body.new_status;
      const decoded = tokenCheck(req, res, {});
      if (decoded){
        const exists = await PostUser.findOne({postId: post_id, userId: user_id});
        if (exists){
          const updatedDocument = await PostUser.findOneAndUpdate(
            {postId: post_id, userId: user_id},  // Query to match document
            {$set: {status: newStatus}},         // Update operation
            {new: true, runValidators: true}     // Options: return updated doc and run validation
          );
          if (!updatedDocument){
            res.status(404).json('Failed to find and update');
          }
          else{
            res.status(200).json("Updated");
          }
        }
        else{
          res.json("Document doesn't exist");
        }
      }
    }
    else{
      res.json("Not every id was valid");
    }
  }
  catch (err){
    res.json("Querry error");
  }
});


router.get("/checkapplied/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  try{
    if (mongoose.Types.ObjectId.isValid(post_id)){
      const decoded = tokenCheck(req, res, {applied: 0});
      if (decoded){
        const exists = await PostUser.findOne({postId: post_id, userId: decoded.userId});
        if (exists){
          res.status(200).json({applied: 1});
        } 
        else{
          res.status(200).json({applied: 0});
        }
      }
    }
    else{
      res.json({applied: 0});
    }
  }
  catch (err){
    res.json({applied: 0});
  }
});


router.delete("/deletepostuser/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  try{
    if (mongoose.Types.ObjectId.isValid(post_id)){
      const decoded = tokenCheck(req, res, {});
      if (decoded){
        const deletedDocument = await PostUser.findOneAndDelete({postId: post_id, userId: decoded.userId});
        if (!deletedDocument) {
          return res.status(404).json("Document not found");
        }
        else{
          res.status(200).json("Done");
        }
      }
    }
    else{
      res.json("Post id not valid");
    }
  }
  catch (err){
    res.json("Querry error");
  }
});


module.exports = router;
