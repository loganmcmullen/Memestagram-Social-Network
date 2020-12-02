const User = require("../models/user-schema");
const express = require("express");
const router = new express.Router();
const auth = require("../auth");

router.post("/", auth, async (req, res) => {
  try {
    //Defining the ID of the user who is REQUESTING to update their bio.
    const userId = req.user.id;

    //Finding the requesting user and updating their biography.
    await User.findByIdAndUpdate(
      userId,
      {
        bio: req.body.bio
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
