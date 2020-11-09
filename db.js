// local db connection, database name bijoycrm
/*const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/bijoycrm',{useNewUrlParser:true,useUnifiedTopology:true},
    err => {
        if (!err)
            console.log('Mongodb connection succeeded.')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    })*/

const mongoose = require("mongoose");
// follwing the environment var is MONGODB_URI that is heroku config set for mongodb atlas
// mongodb+srv://Tarikul:T@rikul1990@cluster0.ayj7n.mongodb.net/bijoycrm?retryWrites=true&w=majority

// mongoose.connect(
//   "mongodb+srv://Tarikul:T@rikul1990@cluster0.ayj7n.mongodb.net/bijoycrm?retryWrites=true&w=majority",
//
mongoose.connect(
  //process.env.MONGODB_URI || "mongodb://localhost:27017/bijoycrm",
  "mongodb+srv://Tarikul:T@rikul1990@cluster0.ayj7n.mongodb.net/bijoycrm?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Mongodb connection succeeded.");
    else
      console.log(
        "Error while connecting MongoDB : " + JSON.stringify(err, undefined, 2)
      );
  }
);
