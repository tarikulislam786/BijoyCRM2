const mongoose = require('mongoose')

var ClientportalUserInfo = mongoose.model('clientportalUserInfo',
{
    UserId : {type:String},
    ClientPortalId : {type:String},
},'clientportalUserInfos')

module.exports = {ClientportalUserInfo}
