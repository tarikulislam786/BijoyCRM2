const mongoose = require('mongoose')

var ClientPortal = mongoose.model('clientportal',
{
    fileName : {type:String},
    userId : {type:String},
    uploadedDate : {type:String},
    fileSize : {type:String},
   // file : {type:String},
  //  multiFiles : {type:Array},
},'clientportals')

module.exports = {ClientPortal}
