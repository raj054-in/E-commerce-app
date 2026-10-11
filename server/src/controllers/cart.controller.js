const cartModel = require("../models/cart.model")
const productModel=require("../models/products.model")


async function getCart(req,res) {
    try {
        const userId=req.user._id
        if(!userId){
            return res.status(400).json({
                message:"User not loggged In"
            })
        }
        const cart=await cartModel.find({
            userId:userId
        }).populate({
            path:"products.productId",
            select:"name price discountPrice images countInStock "
         }
        )
        res.status(200).json({
            message:"Cart Fetched sucessfully",
            cart
        })
        
        
    } catch (error) {
        res.status(500).json({
            error:error.message
        })   
    }
}
async function addToCart(req,res) {
    try {
        const userId=req.user?._id
        const {productId,productQuantity} =req.body
        
        const product=await productModel.findById(productId)
        if(!userId){
             return res.status(400).json({
                 message:"User not loggged In"
                })
            }
        if (!product ||productQuantity>product.countInStock) {
                return res.status(400).json({ message: "Product unavailable or out of stock" });  
            }

            
            let userCart =await cartModel.findOne({userId:userId})
            if (!userCart) {
                userCart=new cartModel({userId:userId,products:[]}) 
            }
    
        const productIndex=userCart.products.findIndex(item=>item.productId.toString()==productId)
        if (productIndex>-1) {
            userCart.products[productIndex].quantity+=productQuantity

        }
        else{
            userCart.products.push({productId,quantity:productQuantity})
        }
        await userCart.save()
        res.status(200).json({
            
            message:"Product Added to the cart sucessfully",
            sucess:true
            
        })
        
    } catch (error) {
        res.status(500).json({
            sucess:false,
            error:error.message
        })  
        
    }
    
}
async function updateCart(req,res) {
    try {
        const {productId,productQuantity}=req.body
        
        const userId=req.user._id
        if(!userId){
            return res.status(400).json({
                message:"User not loggged In"
            })
        }
        const product=await productModel.findById(productId)
        if (!product ||productQuantity>product.countInStock) {
            return res.status(400).json({ message: "Product unavailable or out of stock" });  
        }
        const cartUpdate=await cartModel.updateOne({
            userId:userId,
            "products.productId":productId
        },{
            $set:{
                "products.$.quantity":productQuantity
            }

        })
        if (cartUpdate.matchedCount==0) {
            await cartModel.updateOne({
                userId:userId
            },{
                $push:{
                    products:{productId:productId,quantity:productQuantity}
                }
            },{
                upsert:true
            })
            
        }
        res.status(200).json({
            
            message:"Cart Updated sucessfully",
            sucess:true
            
        })
    
    } catch (error) {
        res.status(500).json({
            sucess:false,
            error:error.message
        })  
        
    }
    
}
async function removeItem(req,res) {
    try {
        const productId=req.body||req.params.id
        const userId=req.user._id
        if(!userId){
            return res.status(400).json({
                message:"User not loggged In"
            })
        }
        await cartModel.updateOne({
                userId:userId
            },{
                $pull:{
                    products:{productId:productId}
                }
            },)
        res.status(200).json({
            
            message:"Item Removed",
            sucess:true
            
        })
        
    } catch (error) {
         res.status(500).json({
            sucess:false,
            error:error.message
        })
        
    }
    
}
async function clearCart(req,res) {
    try {
        const userId=req.user?._id
        if(!userId){
            return res.status(400).json({
                message:"User not loggged In"
            })
        }
          await cartModel.deleteOne({
                userId:userId
            },)
        res.status(200).json({
            
            message:"Cart Cleared",
            sucess:true
            
        })
        
    } catch (error) {
         res.status(500).json({
            sucess:false,
            error:error.message
        })
        
    }
    
}
module.exports={getCart,addToCart,updateCart,removeItem,clearCart}