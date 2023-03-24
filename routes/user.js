const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedby: req.params.id })
        .populate("postedby", "_id name")
        .then((posts) => res.json({ user, posts }));
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, async (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    )
      .select("-password")
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      })
  );
});

router.put("/unfollow", requireLogin, async (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      { new: true }
    )
      .select("-password")
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      })
  );
});
module.exports = router;
