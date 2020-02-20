var express = require("express");
var router = express.Router();
var client = require("../database/connection");

async function findSearchResults(client, search) {
  result = await client
    .db("memestagram")
    .collection("users")
    .findOne({ username: search });
  if (result) {
    console.log("Found user(s):");
    console.log(result);
    return result;
  } else {
    console.log("No users found");
  }
}

router.post("/", async (req, res, next) => {
  try {
    console.log(`Received search request. Search is: ${req.body.search}`);
    findSearchResults(client, req.body.search).then(result => {
      res.json(result.username);
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
