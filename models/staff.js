const mongoose = require('mongoose')

var Staff = mongoose.model('staff',
{
    name : {type:String},
    email : {type:String},
    mobile : {type:Number},
    services : {type:Array},
  //  servicesUpdated : {type:Array}
//    services: [
//    // { type: mongoose.Schema.Types.ObjectId, ref: 'services'    }
//     { type: String, ref: 'services'    }
// ],
    
},'staffs')

module.exports = {Staff}
