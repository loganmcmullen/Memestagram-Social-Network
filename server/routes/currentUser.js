var express = require("express");
var router = express.Router();
const User = require("../models/user-schema");
const auth = require("../auth");

//Path to return a users account details.
//TODO: Stop the user's hashed password from being returned with the response.
//TODO: Add more account details to be returned.
router.get("/", auth, async (req, res) => {
  try {
    //Find a user by their ID and then return their information in JSON to the client.
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
module.exports = router;
