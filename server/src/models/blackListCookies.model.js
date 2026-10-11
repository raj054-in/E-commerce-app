const mongoose = require('mongoose')

const blackListCookieSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        expires:3*24*60*60*1000,
        default:Date.now()
    }

})
blackListCookieSchema.index({token:1})
const blackListTokenModel=mongoose.model("blackslistedtoken",blackListCookieSchema)

module.exports=blackListTokenModel