const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
  res.send("Hello world");
});

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  // console.log(req.body.name
  if (!email || !password || !name) {
    res.status(422).json({ error: "Specify all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpass) => {
        const user = new User({
          email,
          password: hashedpass,
          name,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Sign up account saved successfully" });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
  //   res.json({ message: "Your data is succesfully sent" });
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("hi user");
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Enter email/password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email/password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //   res.json({ message: "successfully signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: {
              _id,
              name,
              email,
              followers,
              following,
              pic,
            },
          });
        } else {
          return res.status(422).json({ error: "Invalid email/password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
