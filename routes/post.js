const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please enter all the fields" });
  }
  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo: pic,
    postedby: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .populate("comments.postc", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
});

router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedby: { $in: req.user.following } })
    .populate("postedby", "_id name")
    .populate("comments.postc", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => console.log(err));
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json(result);
      // return res.status(422).json({ error: err });
    })
    .catch((err) => console.log(err));
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json(result);
      // return res.status(422).json({ error: err });
    })
    .catch((err) => console.log(err));
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    name: req.body.name,
    postc: req.user,
  };
  // console.log(req.user);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postc", "_id name")
    .populate("comments.postc", "_id name")
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        console.log("an error occured");
        // return res.status(422).json({ error: err });
      }
    })
    .catch((err) => console.log(err));
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedby", "_id")
    .then((post) => {
      if (post.postedby._id.toString() === req.user._id.toString()) {
        post
          .deleteOne()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => console.log(err));
      }
    });
});

module.exports = router;
