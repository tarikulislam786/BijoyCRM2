/*const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/bijoycrm',{useNewUrlParser:true,useUnifiedTopology:true},
    err => {
        if (!err)
            console.log('Mongodb connection succeeded.')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    })*/

const express = require("express");
var router = express.Router();
var ObjectID = require("mongoose").Types.ObjectId;
//const [selected, setSelected] = useState([]);
var { Staff } = require("../models/staff");
//const staff_service = require("../models/staff_service");
var { Staff_Service } = require("../models/staff_service");

router.get("/", (req, res) => {
  Staff.find((err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while retrieving all records : " +
          JSON.stringify(err, undefined, 2)
      );
  });
});

router.get("/staff_service/:id?", function (req, res) {
  // responsetours = req.params.id !== undefined ?
  //     tours.filter(     function(obj)   {return obj.id== req.params.id} )
  //     : tours;
  // res.json(responsetours );
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);
  Staff_Service.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while deleting a record : " + JSON.stringify(err, undefined, 2)
      );
  });
});

// save staff and assigned services to them
router.post("/", (req, res) => {
  var newRecord = new Staff({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    services: req.body.services,
  });
  //staff saving
  newRecord.save((err, Staff) => {
    // console.log(Staff.services);
    //console.log()
    if (!err) {
      // staff_service saving
      Staff.services.forEach(function (item) {
        var newRecordForStaffService = new Staff_Service({
          StaffId: Staff._id,
          ServiceId: item.value,
        });
        newRecordForStaffService.save((errStaffService, Staff_Service) => {
          if (!errStaffService) {
            // res.send(Staff);
          } else {
            console.log(
              "Error while creating new record : " +
                JSON.stringify(errStaffService, undefined, 2)
            );
          }
        });
      });
    } else {
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
    email: req.body.email,
    mobile: req.body.mobile,
    services: req.body.services,
  };

  Staff.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, Staff) => {
      if (!err) {
        //res.send(docs);
        // console.log(Staff.servicesUpdated);

        // if services are choosed
        if (Staff.services.length > 0) {
          console.log("service length:" + Staff.services.length);
          console.log("staffid:" + Staff._id);
          Staff_Service.deleteMany({ StaffId: Staff._id })
            .then(function () {
              console.log("Data deleted"); // Success
            })
            .catch(function (error) {
              console.log(error); // Failure
            });
          console.log("after deleted service update arr");
          console.log(Staff.services);
          Staff.services.forEach(function (item) {
            var newRecordForStaffService = new Staff_Service({
              StaffId: Staff._id,
              ServiceId: item.value,
            });
            console.log("StaffId from update arr:" + Staff._id);
            newRecordForStaffService.save((errStaffService, Staff_Service) => {
              if (!errStaffService) {
                // res.send(Staff);
              } else {
                console.log(
                  "Error while creating new record : " +
                    JSON.stringify(errStaffService, undefined, 2)
                );
              }
            });
          });
        }
      } else {
        console.log(
          "Error while updating a record : " + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("No record with given id : " + req.params.id);

  // first remove child table staff_services data
  Staff_Service.deleteMany({ StaffId: req.params.id })
    .then(function () {
      console.log("Data deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  // then remove parent table staffs data
  Staff.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error while deleting a record : " + JSON.stringify(err, undefined, 2)
      );
  });
});

module.exports = router;
