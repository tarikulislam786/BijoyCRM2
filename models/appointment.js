const mongoose = require('mongoose')

var Appointment = mongoose.model('appointment',
{
    startDateTime : {type:String},
    endDateTime : {type:String},
    serviceId : {type:String},
    staffId : {type:String},
    notes : {type:String},
    status : {type:String}
    
},'appointments')

module.exports = {Appointment}
