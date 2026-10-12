const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    // from the cart it will get transfered 
    products:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },
                total:{
                    type:Number,
                    required:true
                }
    
            }
    ],
    // copy from the cart 

    shippingAddress:{
        province:{
            type:String,
            required:true, 
        },
        city:{
            type:String,
            required:true
        },
        area:{
            type:String,
            required:true
        },
        nearestLandmark:{
            type:String,
            required:true
        }  
    },
    shippingFee:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:String,
        required:true
    },
    paymentMehod:{
        type:String,
        required:true,
        enum:[
            "paypal","COD"
        ]
    },
    paymentStatus:{
        type:String,
        required:true,
        enum:[
            "PENDING","PROCESSING","SHIPPED","DELIVERED","CANCELLED"
        ]
    }

    
    
    

},{
    timestamps:true
})
const orderModel=mongoose.model("Order",orderSchema)
module.exports=orderModel