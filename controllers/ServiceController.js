const express = require("express");
var router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport"); // actual passport file
var ObjectID = require("mongoose").Types.ObjectId;

var { Service } = require("../models/service");

/* 
router.get("/", passport.authenticate("jwt", {session : false}), (req, res) => {
  Service.find((err, docs) => {
    if (!err){
      res.send(docs);
      res
      .status(200)
      .json({ name: docs.name, authenticated : true });
    } 
    else {
      res
      .status(500)
      .json({ message: { msgBody: "Error has occured", msgError: true } });
      console.log(
        "Error while retrieving all records : " +
          JSON.stringify(err, undefined, 2)
      );
    }
      
  });
});
*/
router.get("/", (req, res) => {
  Service.find((err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while retrieving all records : " +
          JSON.stringify(err, undefined, 2)
      );   
  });
});

router.post("/", (req, res) => {
  var newRecord = new Service({
    name: req.body.name,
  });

  newRecord.save((err, docs) => {
    if (!err){
      res.send(docs);
    /*  res
      .status(200)
      .json({ message: { msgBody: "Successfully created", msgError: false } }); */
    } 
    else {
       res
      .status(500)
      .json({ message: { msgBody: "Error has occured", msgError: true } }); 
      console.log(
        "Error while creating new record : " + JSON.stringify(err, undefined, 2)
      );
    }
      
  });
});

router.put("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);

  var updatedRecord = {
    name: req.body.name,
  };

  Service.findByIdAndUpdate(
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

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);

  Service.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while deleting a record : " + JSON.stringify(err, undefined, 2)
      );
  });
});

module.exports = router;
