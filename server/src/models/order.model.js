const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
        index:true
    },
    // from the cart it will get transfered 
    items:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                name:{
                    type:String,
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
  
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "NPR" }, 
 
    paymentMethod: { type: String, default: "esewa" },
 
    esewaTransactionUuid: { type: String, index: true },
    esewaRefId: String, 
    
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: Date,
 
    
    deliveryStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    }

},{
    timestamps:true
})
const orderModel=mongoose.model("Order",orderSchema)
module.exports=orderModel