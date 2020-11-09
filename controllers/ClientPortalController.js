const express = require("express");
const { Mongoose } = require("mongoose");
const multer  = require('multer');
const mime  = require("mime-types");
var router = express.Router();
var ObjectID = require("mongoose").Types.ObjectId;
var path = require("path");
var { ClientPortal } = require("../models/clientportal");
var fs = require('fs');
 const storage = multer.diskStorage({
  destination(req, file, cb) {
      cb(null, '../uploads/') // uploads is root directory just underneath the project directory
  },
  filename(req, file, cb) {console.log(file);
    let ext = mime.extension(file.mimetype);
   // cb(null, `${id}.${ext}`);
    //  cb(null, `File-${Date.now()}.${ext}`);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); 
//const router = express.Router();

router.get("/", (req, res) => {
    ClientPortal.find((err, docs) => {
     if (!err) res.send(docs);
     else
       console.log(
         "Error while retrieving all records : " +
           JSON.stringify(err, undefined, 2)
       );
   }).sort({uploadedDate:-1}); 
  //  var sort = { uploadedDate: -1 };
  //  ClientPortal.find().sort(sort).toArray(function(err, docs){
  //   if (!err) res.send(docs);
  //   else
  //     console.log(
  //       "Error while retrieving all records : " +
  //         JSON.stringify(err, undefined, 2)
  //     );
  //  })
   
 });
//  router.post('/', upload.single('fileName'), (req, res) => {
//   res.send(`/${req.file.path}`);
// }) .array("multi-files", 10);
//router.post("/", upload.single('fileName'), (req, res) => {
 router.post("/", upload.single('fileName'), (req, res) => {
  var newRecord = new ClientPortal({
    fileName: req.file.path,
    uploadedDate: new Date(),
    fileSize: req.file.size,
    userId: req.body.userId
  });

  newRecord.save((err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while creating new record : " + JSON.stringify(err, undefined, 2)
      );
  });
}); 

router.put("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);

  var updatedRecord = {
    fileName: req.body.fileName,
    userId: req.body.userId,
    uploadedDate: req.body.uploadedDate,
    fileSize: req.body.fileSize,
  //  file: req.body.file
  };

  ClientPortal.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else
        console.log(
          "Error while updating a record : " + JSON.stringify(err, undefined, 2)
        );
    }
  );
});
// download image
// router.get("/download/:id", (req, res) => {
//   ClientPortal.find(
//     { _id: req.params.id }, (err, data) => {
//       if(err) {
//         console.log(err);
//       } else {
//         var x = __dirname+'/'+data[0].fileName;
//         //var x = __dirname+data[0].fileName; // as file path
//         res.download(x);
//       }
//     }
//   ); 
 
// });
router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);

    ClientPortal.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
      console.log("should be deleteed")
      fs.unlink(docs.fileName,function(err){
        if(err){
          console.log("Error while deleting the file "+err);
        }
    });
    }
    else
      console.log(
        "Error while deleting a record : " + JSON.stringify(err, undefined, 2)
      );
  });
});

module.exports = router;
