const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const postSchema = require("../models/post");
const userSchema = require("../models/user");

const Post = mongoose.model("Post", postSchema);

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(402).json({ error: "Please add all fields" });
  }
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  console.log(req.user);
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy")
    .then((posts) => {
      res.json({ posts });
      console.log(req.user);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
