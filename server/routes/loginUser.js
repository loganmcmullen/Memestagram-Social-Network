var express = require("express");
var router = express.Router();
var client = require("../database/connection");

async function loginUser(client, user) {
  result = await client
    .db("memestagram")
    .collection("users")
    .findOne({ username: user.username, password: user.password })
    .then(user => {
      if (!user) {
        console.log("404");
        return false;
      } else {
        console.log("200");
        return true;
      }
    });
}

router.post("/", function(req, res) {
  try {
    console.log("Received login request");
    loginUser(client, {
      username: req.body.username,
      password: req.body.password
    }).then(result => {
      if (result == false) {
        res.status(404).send();
      } else {
        res.status(200).send();
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
