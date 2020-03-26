//Initializing express, middleware, CORS
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
var router = express.Router();

const user = require("./models/user-schema");

//Loading middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(morgan("tiny"));

/*Validation
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*'),
  res.header('Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept, Autorization');
  if (req.method --- 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
})*/

//Initialize database connection
const connectDatabase = require("./database/connection");
connectDatabase();

//Middleware and processing for uploading and requesting user photos
//from the database.
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
const uploadedImageRoutes = require('./routes/uploadedImage');
app.use('/api/uploadedImage', uploadedImageRoutes);

//Listen on Port 8000
const port = process.env.PORT || 8000;

//Exportable server which is used for integration testing.
var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.use(morgan("tiny"));
app.use('/uploads', express.static('uploads'));

//Default path
app.get("/", (req, res) => {
  res.send("Hello World Test!");
});

//path POST /upload
app.post("/uploads", upload.single("myImage"), (req, res) => {
  console.log(`File: ${req}`);
  res.json({ file: req.file });
});

//Schemas
const Schema = mongoose.Schema;

//Blog post schema
const BlogPostSchema = new Schema({
  title: String,
  body: String,
  date: {
    type: String,
    default: Date.now()
  }
});

/*User upload schema
const uploadContentSchema = new Schema ({
  username: String,
});

const tempImageStorage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, 'uploads/')
  }
});

const multer = require('multer');
const upload = multer({storage: tempImageStorage});
router.route('img_data').post(upload.single('file'), function(req, res))*/


//Models
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

/*var doc = mongoose.model('user', new Schema(
  {username : String})
); 
*/

// Route Test
app.get('/api', (req, res) => {
  BlogPost.find({  })
      .then((data) => {
          console.log('Data: ', data);
          res.json(data);
      })
      .catch((error) => {
          console.log('error: ', daerrorta);
      });
});

//Route username test
app.get('/api/users', (req, res) => {
  user.find({  })
      .then((user) => {
          console.log('User information: ', user);
          res.json(user);
      })
      .catch((error) => {
          console.log('error: ', daerrorta);
      });
});

app.get('api/username', function(req, res, next){

}); 

app.get('insert', function(req, res, next){

}); 

app.get('update', function(req, res, next){

}); 

app.get('delete', function(req, res, next){

}); 


/*---------------------------------How data is moved ---------------------------------------
const Schema = mongoose.Schema;

//Blog post schema
const BlogPostSchema = new Schema({
  title: String,
  body: String,
  date: {
    type: String,
    default: Date.now()
  }
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);


//Saving data to database TEST
const data = {
  title: "Test 66",
  body: "Description test 66"
};

const newBlogPost = new BlogPost(data);
newBlogPost.save( (error) => {
  if (error) {
    console.log("ERROR: not saved");
  }  
  else {
    console.log("SAVED");
  }
});

---------------------------------------------------------------------------------------------*/

module.exports = server;
