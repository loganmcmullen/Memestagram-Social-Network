//Initializing express, middleware, and CORS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const config = require("./database/default");
const uri = config.ConnectionUrl;
const morgan = require("morgan");
const app = express();

//Loading middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());

//Initialize database connection
const connectDatabase = require("./database/connection");
connectDatabase();

const conn = mongoose.createConnection(uri);

let gfs;
conn.once("open", () => {
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

//Loading router modules
var login = require("./routes/loginUser");
app.use("/api/login", login);
var register = require("./routes/registerUser");
app.use("/api/register", register);
var search = require("./routes/searchUser");
app.use("/api/search", search);
var currentuser = require("./routes/currentUser");
app.use("/api/currentuser", currentuser);
var following = require("./routes/following");
app.use("/api/follow", following);

//Listen on Port 8000
const port = process.env.PORT || 8000;

var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.use(morgan("tiny"));

//Default path
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//path POST /upload

app.post("/uploads", upload.single("myImage"), (req, res) => {
  console.log(`File: ${req}`);
  res.json({ file: req.file });
});

module.exports = server;
