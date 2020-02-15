//Basic requirements
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const app = express();

//Mongo Atlas requirements
const mongoclient = require("mongodb").MongoClient;
const objectid = require("mongodb").ObjectID;
const uri =
  "mongodb+srv://<username>:<password>@cluster0-pf0b2.mongodb.net/test?retryWrites=true&w=majority";
const userModel = require("./user-schema");

//Middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({ secret: "secretstring", resave: false, saveUninitialized: true })
);

//Start server
var database, collection;
const port = process.env.PORT || 8000;
app.listen(port, () => {
  mongoclient.connect(uri, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db("memestagram");
    collection = database.collection("users");
    console.log("Connected to database: memestagram!");
  });
  console.log(`Listening on ${port}`);
});

//Default path
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//Create a user for sign up
app.post("/signup", (request, response) => {
  const User = new userModel(request.body);
  collection.insertOne(User, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    console.log(`New user created with the following id: ${result.insertedId}`);
    response.status(200).send();
  });
});
//Check if a user exists for sign in, and then start a session
app.post("/login", (request, response) => {
  var username = request.body.username;
  var password = request.body.password;
  collection
    .findOne({ username: username, password: password })
    .then(user => {
      if (!user) {
        console.log("Matching Account not found");
        return response.status(404).send("Matching Account not found");
      } else {
        request.session.user = user;
        console.log("Matching Account found");
        return response.status(200).send("Matching Account found");
      }
    })
    .catch(err => console.error(`Failed to find document: ${err}`));
});
//Create a dashboard that is only available if a session exists (aka user is signed in)
app.get("/home", (request, response) => {
  if (!request.session.user) {
    return response.status(401).send();
  } else {
    return response.status(200).send("User granted access to home");
  }
});
//Sign a user out
app.get("/logout", (request, response) => {
  request.session.destroy();
  return res.status(200).send();
});
//Search for users
app.post("/search", (request, response) => {
  var searchterm = request.body.search;
  console.dir("Search received, checking database...");
  collection.find({ username: searchterm }).toArray((error, result) => {
    if (error) {
      console.log("Error");
      return response.status(500).send(error);
    }
    if (result !== undefined) {
      //console.log(result);
      console.log("Matches found");
      for (var i = 0; i < result.length; i++) {
        delete result[i]["email"];
        delete result[i]["password"];
      }
      response.json(result);
    } else {
      console.log("No Results Found");
    }
  });
});
