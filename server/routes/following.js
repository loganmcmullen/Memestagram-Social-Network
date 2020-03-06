const User = require("../models/user-schema");
const express = require("express");
const router = new express.Router();
const auth = require("../auth");

//Send all users that are followed for a requesting user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400).json({ message: "User with matching ID not found" });
    }

    const userFollowing = user.following;
    if (!userFollowing) {
      res.status(400).json({ message: "User Followers not found" });
    }
    console.log({ following: userFollowing });
    res.status(200).json({ following: userFollowing });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//Follow a new User
router.post("/new", auth, async (req, res) => {
  try {
    //Assigning id of user where the new follow will be stored.
    const userId = req.user.id;

    //Check if a username was sent with the request.
    if (!req.body.username) {
      return res.status(404).json({ message: "No username received." });
    }
    //Find id associated with that username
    const followUsername = req.body.username;
    //Check if user exists inside database. If user does not exist, return status 404.
    let userToFollow = await User.findOne({ username: followUsername });
    if (!userToFollow) {
      return res.status(400).json({
        message: "User does not exist in database"
      });
    }

    //Update the user's document with the new follow
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: followUsername }
      },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json(err);
        }
        return res.status(200).json(doc);
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
