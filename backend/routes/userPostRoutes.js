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

module.exports = router;
