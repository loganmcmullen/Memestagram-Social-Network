var express = require("express");
var router = express.Router();
const User = require("../models/user-schema");
const auth = require("../auth");
/**
 * If a username matching the search query from the user
 * is found in the database, send back a json response
 * of the user that was found. Will eventually need to return
 * a unique profile ID so that users can visit the profile.
 */
router.post("/", auth, async (req, res, next) => {
  try {
    //Find a user by their ID and then return their information in JSON to the client.
    const user = await User.findOne({ username: req.body.username });
    res.status(200).json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
