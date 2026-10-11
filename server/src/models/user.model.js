const mongoose = require("mongoose")
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    },
    email:{
        type:String, 
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        enum:[
            "user","admin"
        ],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const userModel= mongoose.model( "User",userSchema)
module.exports=userModel