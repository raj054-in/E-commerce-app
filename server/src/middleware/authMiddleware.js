const jwt=require("jsonwebtoken")
const userModel=require("../models/user.model")
const blackListTokenModel=require('../models/blackListCookies.model')
async function authMiddleWare(req,res,next) {
    try {
        const token=req.cookies.token
        if (!token) {
            return res.status(409).json({
                message:"Unauthorized"
            })
        }
        const isTokenBList=await blackListTokenModel.findOne({
            token
        })
        if (isTokenBList) {
             return res.status(401).json({
                message:"Unauthorized"
            }) 
        }

        const decoded= await jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decoded) {
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const user=await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                message:"user not found"
            })  
        }
        req.user=user
        next()
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
        
    }
}
module.exports={authMiddleWare}