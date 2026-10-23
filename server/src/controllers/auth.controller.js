const userModel=require('../models/user.model')
const blackListTokenModel=require('../models/blackListCookies.model')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const {UploadAvatar}=require("../config/cloudinary")

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
}

async function SignUp(req, res) {
    try {
    const {name,email,password}=req.body
    
    
    if (!email||!name||!password) {
        return res.status(400).json({
            error:"Fill all the Credentials "
        })
    }
    const validators = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        name: /^[a-zA-Z\s]{2,50}$/   
    };
    if (!validators.name.test(name)) {
        return res.status(400).json({
            error:"Invalid Name Format"
        })
    }
    if (!validators.email.test(email)) {
        return res.status(400).json({
            error:"Invalid email format"
        })  
    }
    if (!validators.password.test(password)) {
        return res.status(400).json({
            error:"Invalid Password format"
        })   
    }
    const userAlreadyExists= await userModel.findOne({
        email
    })
    if(userAlreadyExists){
        return res.status(409).json({
            message:"The user with the email already exists"
        })
    }
    let image=null
    if (req.file&&req.file.buffer) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        image=await UploadAvatar(dataURI)
        
    }
    const hashedPassword=await bcrypt.hash(password, 10)
    const createUser = await userModel.create({
            name,image,email,password:hashedPassword
        })
        const token = await jwt.sign({id:createUser._id,role:createUser.role},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
        const userResponse = createUser.toObject()
        delete userResponse.password
        res.cookie("token", token, authCookieOptions)
        res.status(201).json({
            message:"user Registered Sucessfully",
            user:userResponse
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })   
    }    
}
async function LogIn(req,res) {
    try {
        const {email ,password}=req.body
        const validators = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            
        }
        if (!email||!password) {
            return res.status(400).json({
            error:"Fill all the Credentials "
        })   
        }
        if (!validators.email.test(email)) {
            return res.status(400).json({
            error:"Invalid email format"
        })  
        }
        const user =await  userModel.findOne({
            email
        }).select("+password")
        if (!user) {
            return res.status(401).json({
                message:"Incorrect email or password"
            })
        }
        const validateUser = await bcrypt.compare(password,user.password)
        if(!validateUser){
            return res.status(401).json({
                message:"Incorrect email or password"
            })
        }
        const token = await jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
        res.cookie("token", token, authCookieOptions)
        const userRes=user.toObject()
        delete userRes.password
        res.status(200).json({
            message:"User Logged In sucessfully",
            user:userRes
        })        
    } catch (error) {
        res.status(500).json({
            error:error.message
        })        
    } 
}
async function LogOut(req,res) {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(200).json({
                message:"Already Logged Out"
            })
        }
        await blackListTokenModel.create({
            token
        })
        res.clearCookie("token", authCookieOptions)
        res.status(200).json({
            message:"User logged out sucessfully "
        })

        
    } catch (error) {
         return res.status(500).json({
            error: error.message
        });
        
    }
}
async function getProfile(req,res) {
    try {
        res.status(200).json(req.user)
        
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
        
    }
    
}

module.exports={SignUp,LogIn,LogOut,getProfile}
