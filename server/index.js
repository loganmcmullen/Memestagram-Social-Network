
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
var router = express.Router();

const user = require("./models/user-schema");

//Loading middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());

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

//Exportable server which is used for integration testing.
var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});


//Default path
app.get("/", (req, res) => {
  res.send("Hello World Test!");
});

//path POST /upload
app.post("/uploads", upload.single("myImage"), (req, res) => {
  console.log(`File: ${req}`);
  res.json({ file: req.file });


//path POST /upload
app.post("/uploads", upload.single("myImage"), (req, res) => {
  console.log(`File: ${req}`);
  res.json({ file: req.file });
});

app.post('/uploads', upload.single('myImage' ), (req, res) => {
  console.log(`File: ${req}`)
  res.json({file: req.file})
  //res.json({file: req.file})
  res.redirect('/');

});

//------------------MICHAEL MISO'S STUFF----------------------------------


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

//Models
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);


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

//------------------MICHAEL MISO'S STUFF^^^^^----------------------------------

//@route GET /files/:filename
// @desc Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if(!files || files.length===0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    //Files exist
    return res.json(files);
  })
});


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
    file.contentType === 'image/png' || 
    file.contentType === 'image/img' || 
    file.contentType === 'image/jpg' || 
    file.contentType === 'image/gif' || 
    file.contentType === 'image/tif') {

      //Read output to browser

      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });

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
          file.contentType === 'image/png' || 
          file.contentType === 'image/img' || 
          file.contentType === 'image/jpg' || 
          file.contentType === 'image/gif' || 
          file.contentType === 'image/tif') 
        {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    }
    res.sendFile({files:files});
    res.render('profile', {files: files} );
    });
  });

app.delete('/files/:id', (req, res) => {
  gfs.remove({_id: req.params.id, root: 'upload'}, (err, gridStore) => {
    if(err){
      return res.status(404).json({ err: err});
    }
    res.redirect('/');
  });
});


module.exports = server;
