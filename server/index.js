
//Initializing express, middleware, and CORS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer")
const GridFsStorage = require("multer-gridfs-storage")
const Grid = require("gridfs-stream")
const methodOverride = require("method-override")
const config = require("./database/default");
const uri = config.ConnectionUrl;

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
conn.once('open', () => {
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
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

const upload = multer({storage});

//Loading router modules
var login = require("./routes/loginUser");
app.use("/api/login", login);
var register = require("./routes/registerUser");
app.use("/api/register", register);
var search = require("./routes/searchUser");
app.use("/api/search", search);
var currentuser = require("./routes/currentUser");
app.use("/api/currentuser", currentuser);

//Listen on Port 8000
const port = process.env.PORT || 8000;

var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

//path POST /upload

app.post('/uploads', upload.single('myImage' ), (req, res) => {
  console.log(`File: ${req}`)
  //res.json({file: req.file})
  res.redirect('/');

});

//@route GET /files
// @desc Display all files in JSON

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //Check if files exist
    if(!files || files.length ===0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);

  })
})

//@route GET /files/:filename
// @desc Display all files in JSON

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file
    if (!file || file.length ===0){
      return res.status(404).json({
        err: 'No file exist'
      });
    }
    // File exists
    return res.json(file);
  });
});

//@route GET /image/:filename
//@desc Display Image

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file
    if (!file || file.length ===0){
      return res.status(404).json({
        err: 'No file exist'
      });
    }
    //Check if image

    if(file.contentType === 'image/jpeg' || 
    file.contentType === 'img/png' || 
    file.contentType === 'img/img' || 
    file.contentType === 'img/jpg' || 
    file.contentType === 'img/gif' || 
    file.contentType === 'img/tif') {

      //Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      })

    }
  });
});

app.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //Check if files exist
    if(!files || files.length ===0){
      res.render('profile', {files: false});
    } else {
      files.map(file => {
        if(
          file.contentType === 'image/jpeg' || 
          file.contentType === 'img/png' || 
          file.contentType === 'img/img' || 
          file.contentType === 'img/jpg' || 
          file.contentType === 'img/gif' || 
          file.contentType === 'img/tif') 
        {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    }
    res.render('profile', {files: files})

    // Files exist
    return res.json(files);

    });
  });

module.exports = server;
