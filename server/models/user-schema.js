const mongoose = require("mongoose");

//Creating standard user schema with mongoose.
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    posts: {
      description: { type: String },
      photoid: { type: String },
      commentid: { type: String }
    },
    bio: {
      type: String
    }
  },
  { collection: "users" }
);

const user = mongoose.model("user", UserSchema);
module.exports = user;
