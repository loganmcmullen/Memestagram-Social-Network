//Basic requirements
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//Mongo Atlas requirements
const mongoclient = require("mongodb").MongoClient;
const objectid = require("mongodb").ObjectID;
const uri =
  "mongodb+srv://greg34910:cookie123@cluster0-pf0b2.mongodb.net/test?retryWrites=true&w=majority";
const userModel = require("./user-schema");

//Middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
    response.send(User);
    console.log(`New user created with the following id: ${result.insertedId}`);
  });
});
//Check if a user exists for sign in
app.post("/login", (request, response) => {
  var username = request.body.username;
  var password = request.body.password;
  collection
    .findOne({ username })
    .then(user => {
      if (user) {
        console.log(`Success! User found: ${user.username}`);
        if (password == user.password) {
          console.log(`Passwords match!`);
          response.json({ success: true });
        } else {
          console.log(`Invalid Password entered!`);
          response.json({ success: false });
        }
      } else {
        console.log("No users found that match.");
        response.json({ success: false });
      }
    })
    .catch(err => console.error(`Failed to find document: ${err}`));
});
//Search for users
app.get("/api/users", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});
