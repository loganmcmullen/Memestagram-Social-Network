//Initializing express, middleware, CORS
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
var morgan = require("morgan");
const methodOverride = require("method-override");

//Loading middleware and CORS
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(morgan("tiny"));

//Loading router modules
var login = require("./routes/loginUser");
app.use("/api/login", login);
var register = require("./routes/registerUser");
app.use("/api/register", register);
var search = require("./routes/searchUser");
app.use("/api/search", search);
var currentuser = require("./routes/currentUser");
app.use("/api/currentuser", currentuser);
var searchuser = require("./routes/searchUser");
app.use("/api/searchuser", searchuser);
var followuser = require("./routes/following");
app.use("/api/follow", followuser);
var updatebio = require("./routes/updateBio");
app.use("/api/updatebio", updatebio);
var photos = require("./routes/photos");
app.use("/api/photos", photos);

//Listen on Port 8000
const port = process.env.PORT || 8000;

//Exportable server which is used for integration testing.
var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

//Default path
app.get("/", (req, res) => {
  res.send("Hello World Test!");
});

module.exports = server;
