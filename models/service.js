const mongoose = require('mongoose')

var Service = mongoose.model('service',
{
    name : {type:String},
},'services')

module.exports = { Service}