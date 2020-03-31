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
    await User.findOneAndUpdate(
      { username: followUsername },
      {
        $addToSet: { followers: req.user.username }
      },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json(err);
        }
      }
    );

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

//Path to unfollow a new user. *
router.patch("/remove", auth, async (req, res) => {
  try {
    //Defining the ID of the user who is REQUESTING to unfollow a new user.
    const userId = req.user.id;

    //If the username of the REQUESTED unfollow does not exist in the HTTP request body,
    //return status 404 not found.
    if (!req.body.username) {
      return res.status(404).json({ message: "No username received." });
    }

    //Initialize unfollowUsername with the username of the REQUESTED follow.
    const unfollowUsername = req.body.username; //*
    //Check if the REQUESTED unfollow actually exists inside of the users following list.
    //If the user exists, add the requesting user to their list of followers.
    let userToUnfollow = await User.findOneAndUpdate(
      { username: unfollowUsername },
      {
        $pull: { followers: req.user.username }
      },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json(err);
        }
      }
    );
    if (!userToUnfollow) {
      return res.status(400).json({
        message: "User does not exist in database"
      });
    }

    //Update the REQUESTING user's account with the new user who they are unfollowing using
    //$pull (mongoose syntax). If successful, return status 200.
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: unfollowUsername }
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
