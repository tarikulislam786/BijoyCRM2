const express = require("express");
const { Mongoose } = require("mongoose");

var router = express.Router();
var ObjectID = require("mongoose").Types.ObjectId;

var { Appointment } = require("../models/appointment");

/* 
Mongo nodejs joining why not working will checked later
router.get("/", (req, res) => {
  Appointment.aggregate([
    {
      $lookup: {
        from: "services",
        as: "services",
        let: {serviceId: "$_id"},
        pipeline: [
          {$match : {$expr: { $eq: ['$serviceId', '$serviceId']}}},
        ]
      },
    },
    {
      $unwind:"$services"
  },
  {
    $lookup: {
      from: "staffs",
      as: "staffs",
      let: {staffId: "$_id"},
      pipeline: [
        {$match : {$expr: { $eq: ['$staffId', '$staffId']}}},
      ]
    },
  },
  {
    $unwind:"$staffs"
},
    {
      $project: {
        _id:1,
        servicename:"$services.name",
        staffname:"$staffs.name"
      }
    }
    
  ]).exec((err, result)=>{
    if(err){
      res.send(err);
    }
    if(result){
      res.send({
        error: false,
        data:result
      })
    }
  })
});
*/

router.get("/", (req, res) => {
   Appointment.find((err, docs) => {
     if (!err) res.send(docs);
     else
       console.log(
         "Error while retrieving all records : " +
           JSON.stringify(err, undefined, 2)
       );
   }); 
   
 });

router.post("/", (req, res) => {
  var newRecord = new Appointment({
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
    serviceId: req.body.serviceId,
    staffId: req.body.staffId,
    notes: req.body.notes,
    status: req.body.status
    
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
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
    serviceId: req.body.serviceId,
    staffId: req.body.staffId,
    notes: req.body.notes,
    status: req.body.status
  };

  Appointment.findByIdAndUpdate(
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

    Appointment.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while deleting a record : " + JSON.stringify(err, undefined, 2)
      );
  });
});

module.exports = router;
