const { SignUp, LogIn,LogOut,getProfile } = require("../controllers/auth.controller")


const routes = require('express').Router()
const multer=require('multer')
const { authMiddleWare } = require("../middleware/authMiddleware")
const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        if (file.mimetype.startsWith('image/')) {
            cb(null,true)
            
        } else {
            cb(new Error('Only JPG, PNG, or WEBP image formats are allowed!'), false);
            
        }

    }

})

routes.post("/signup",upload.single("avatar"), SignUp)
routes.post("/login",LogIn)
routes.post("/logout",LogOut)
routes.get("/get-profile",authMiddleWare,getProfile)

module.exports=routes