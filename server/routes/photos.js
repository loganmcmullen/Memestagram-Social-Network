const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const config = require("../database/default");
const uri = config.ConnectionUrl;
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const auth = require("../auth");
const User = require("../models/user-schema");
const express = require("express");
const router = new express.Router();

//Initialize database connection
const connectDatabase = require("../database/connection");
//Initialize database connection
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
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.get("/", auth, (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //Check if files exist
    if (!files || files.length === 0) {
      res.render("profile", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png" ||
          file.contentType === "image/img" ||
          file.contentType === "image/jpg" ||
          file.contentType === "image/gif" ||
          file.contentType === "image/tif"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    }
    res.sendFile({ files: files });
    res.render("profile", { files: files });
  });
});

//path POST /upload
router.post("/uploads", auth, upload.single("myImage"), async (req, res) => {
  //Since the above middleware has already stored the image, the user document must
  //now be updated with a reference to the image and the description for the photo.
  const description = req.body.myDescription;
  try {
    //Find the user using the id and add a new post object containing the photoid and the description.
    let userId = await User.findById(req.user.id);
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          posts: { photoid: req.file.id, description: description },
        },
      },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json(err);
        }
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }

  //Return the stored file to the client.
  res.json({ file: req.file });
});

// @route GET /files
// @desc Display all files for the CURRENT user in JSON
router.get("/files", auth, async (req, res) => {
  try {
    //Search for all files stored by the requesting user.
    const user = await User.findById(req.user.id);
    let objectIdArray = user.posts.photoid.map((s) =>
      mongoose.Types.ObjectId(s)
    );
    gfs.files.find({ _id: { $in: objectIdArray } }).toArray((err, files) => {
      //Check if file matching those stored in the users document exist. If not, return status 404.
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      //If file matching those stored in the users document exist, create "description" field and attach the description to the file objects.
      for (var i = 0; i < files.length; i++) {
        files[i]["description"] = user.posts.description[i];
      }

      //Return the files to the server.
      return res.json(files);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route GET /files
// @desc Display all files for a REQUESTED user in JSON
router.post("/searchuser/files", async (req, res) => {
  try {
    console.log(req.body);
    //Search for all files stored by the requesting user.
    const user = await User.findOne({ username: req.body.username });
    let objectIdArray = user.posts.photoid.map((s) =>
      mongoose.Types.ObjectId(s)
    );
    gfs.files.find({ _id: { $in: objectIdArray } }).toArray((err, files) => {
      //Check if file matching those stored in the users document exist. If not, return status 404.
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      //If file matching those stored in the users document exist, create "description" field and attach the description to the file objects.
      for (var i = 0; i < files.length; i++) {
        files[i]["description"] = user.posts.description[i];
      }

      //Return the files to the server.
      return res.json(files);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file exists
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist",
      });
    }
    //If files exists, return file to client
    return res.json(file);
  });
});

router.post("/files/likes", (req, res) => {
  gfs.files.findOneAndUpdate(
    { filename: req.body.filename },
    { $addToSet: { likes: req.body.likes } },
    { new: true, upsert: true },
    (err, file) => {
      //Check if file exists
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exist",
        });
      }
      //If files exists, return file to client
      return res.json(file);
    }
  );
});
router.post("/files/dislikes", (req, res) => {
  gfs.files.findOneAndUpdate(
    { filename: req.body.filename },
    { $addToSet: { dislikes: req.body.dislikes } },
    { new: true, upsert: true },
    (err, file) => {
      //Check if file exists
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exist",
        });
      }
      //If files exists, return file to client
      return res.json(file);
    }
  );
});

router.delete("/files/:_id", (req, res) => {
  gfs.remove({ _id: req.params._id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
  res.redirect("/");
});

//@route GET /image/:filename
//@desc Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist",
      });
    }
    //Check if image

    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/img" ||
      file.contentType === "image/jpg" ||
      file.contentType === "image/gif" ||
      file.contentType === "image/tif"
    ) {
      //Read output to browser

      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});
module.exports = router;
