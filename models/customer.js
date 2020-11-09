const mongoose = require('mongoose')

var Customer = mongoose.model('customer',
{
    name : {type:String},
    email : {type:String},
    mobile : {type:Number},
    phone : {type:Number},
    address : {type:String},
    city : {type:String},
    state : {type:String},
    zip : {type:Number},
    ssn : {type:Number},
},'customers')

module.exports = {Customer}
