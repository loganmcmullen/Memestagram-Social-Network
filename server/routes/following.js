const User = require("../models/user-schema");
const express = require("express");
const router = new express.Router();
const auth = require("../auth");

//Path to return all of a specific users followers.
router.get("/", auth, async (req, res) => {
  try {
    //Search the database for the user who is REQUESTING to view all his followers.
    //If this user does not exist, return status 400.
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400).json({ message: "User with matching ID not found" });
    }

    //If the REQUESTING user exists, but the user does not have any users who they
    //are following, return status 400.
    const userFollowing = user.following;
    if (!userFollowing) {
      res.status(400).json({ message: "User Followers not found" });
    }

    //If the REQUESTING user exists, and they are following other users, return the list
    //of all their followers.
    res.status(200).json({ following: userFollowing });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//Path to follow a new user.
router.post("/new", auth, async (req, res) => {
  try {
    //Defining the ID of the user who is REQUESTING to follow a new user.
    const userId = req.user.id;

    //If the username of the REQUESTED follow does not exist in the HTTP request body,
    //return status 404 not found.
    if (!req.body.username) {
      return res.status(404).json({ message: "No username received." });
    }

    //Initialize followUsername with the username of the REQUESTED follow.
    const followUsername = req.body.username;

    //Check if the REQUESTED follow actually exists inside of the database.
    //If the user does not exist, return status 400.
    let userToFollow = await User.findOne({ username: followUsername });
    if (!userToFollow) {
      return res.status(400).json({
        message: "User does not exist in database"
      });
    }

    //Update the REQUESTING user's account with the new user who they are following using
    //$addToSet (mongoose syntax). If successful, return status 200.
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
