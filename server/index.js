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
const mongoose = require('mongoose');
const app = express();
var router = express.Router();

const user = require("./models/user-schema");

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

//Default path
app.get("/test", (req, res) => {
  res.send("Test");
});


//-----------------------------------------------------------------------
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

//User upload schema
// const uploadContentSchema = new Schema ({
//   username: String,
// });

// const tempImageStorage = multer.diskStorage({
//   destination: function(req, res, cb) {
//     cb(null, 'uploads/')
//   }
// });

// const multer = require('multer');
// const upload = multer({storage: tempImageStorage});
// router.route('img_data').post(upload.single('file'), function(req, res))





//Models
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
//const uploadPost = mongoose.model('user', uploadContentSchema);

// var doc = mongoose.model('user', new Schema(
//   {username : String})
// ); 

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

// app.get('api/users', (req, res) => {
//   uploadPost.find({  })
//       .then((user) => {
//           console.log('Username: ', user);
//           res.json(user);
//       })
//       .catch((error) => {
//           console.log('error: ', daerrorta);
//       });
// });

app.get('api/username', function(req, res, next){

}); 

app.get('insert', function(req, res, next){

}); 

app.get('update', function(req, res, next){

}); 

app.get('delete', function(req, res, next){

}); 


//---------------------------------How data is moved ---------------------------------------
// const Schema = mongoose.Schema;

// //Blog post schema
// const BlogPostSchema = new Schema({
//   title: String,
//   body: String,
//   date: {
//     type: String,
//     default: Date.now()
//   }
// });

// const BlogPost = mongoose.model('BlogPost', BlogPostSchema);


// //Saving data to database TEST
// const data = {
//   title: "Test 66",
//   body: "Description test 66"
// };

// const newBlogPost = new BlogPost(data);
// newBlogPost.save( (error) => {
//   if (error) {
//     console.log("ERROR: not saved");
//   }  
//   else {
//     console.log("SAVED");
//   }
// });

//---------------------------------------------------------------------------------------------

// //Get user data 
// app.get('/api', (req,res) => {
//   BlogPost.find({ })
//     .then((data) => {
//       Console.log('Data: ', data);
//     })
//     .catch((error) => {
//       Console.log('Error:', daerrorta);
//     })
// });

// app.get('/saved', (req, res) => {
//   console.log('Body: ', req.body); 
//   res.body({
//     msg: 'We received your data'
//   });
// });

//Instead of putting everything in index.js
//TODO: Create .js file in routes called /api
//TODO: const routes = require('./routes/api');
//TODO: app.use('/api', routes); 







module.exports = server;
