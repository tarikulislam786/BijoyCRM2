const mongoose = require('mongoose')

var Staff_Service = mongoose.model('staff_service',
{
    StaffId : {type:String},
    ServiceId : {type:String},
},'staff_services')

module.exports = { Staff_Service}