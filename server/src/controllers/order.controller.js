
const cartModel= require('../models/cart.model')
const orderModel=require('../models/order.model')
const {buildPaymentForm,decodeAndVerifyCallback,checkTransactionStatus}=require('../config/esewa')
const productModel = require('../models/products.model')
const userModel = require('../models/user.model')


async function getMyOrders(req,res) {
    try {
        const userId=req.user._id
        const orders= await orderModel.find({
            userId:userId
        }).sort({ createdAt: -1 })
        res.status(200).json({
            message:"You Orders Fetched Sucessfully",
            orders
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
        
    }


    
}
async function startPayment(order){
    order.esewaTransactionUuid = `${order._id}-${Date.now().toString(36)}` // letters, digits and "-" only
    await order.save()
    return buildPaymentForm(order, order.esewaTransactionUuid)

}
async function createOrder(req,res) {
    try {
       const {province,city,area,nearestLandmark} =req.body
       const userId= req.user._id
       if (![province,city,area,nearestLandmark].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ message: "Complete shipping details are required" })
       }
       const cart= await cartModel.findOne({userId:userId}).populate("products.productId")
       if(!cart ||cart.products.length==0){
        return res.status(400).json({
            message:"The cart is Empty"
        })
       }
       let items=[]
       let totalAmount=0
       for(const item of cart.products ){
        items.push({
            productId:item.productId._id,
            name:item.productId.name,
            quantity:item.quantity,
             total:(item.productId.discountPrice || item.productId.price)*item.quantity
        })
         totalAmount+=(item.productId.discountPrice || item.productId.price)*item.quantity

       }
       const order=await orderModel.create({
        userId:userId,
        items:items,
        shippingAddress:{
            province:province,
            city:city,
            area:area,
            nearestLandmark:nearestLandmark
        },
        totalAmount:totalAmount,
       })
       const esewa= await startPayment(order)
       res.status(201).json({
        orderId:order._id, 
        esewa
       })


    
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
        
    }
    
}

async function resumePendingPayment(req, res) {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({ message: "This order has already been paid" })
        }

        const esewa = await startPayment(order)
        return res.status(200).json({
            orderId: order._id,
            esewa
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function deletePendingOrder(req, res) {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.paymentStatus !== "pending") {
            return res.status(400).json({
                message: "Only pending payment orders can be deleted"
            })
        }

        if (order.esewaTransactionUuid) {
            let status
            try {
                status = await checkTransactionStatus({
                    totalAmount: order.totalAmount,
                    transactionUuid: order.esewaTransactionUuid
                })
            } catch (error) {
                return res.status(503).json({
                    message: "Unable to confirm the eSewa payment status. Try again."
                })
            }

            if (status.status === "COMPLETE") {
                return res.status(409).json({
                    message: "This payment is complete and cannot be deleted"
                })
            }

            if (status.status === "PENDING") {
                return res.status(409).json({
                    message: "This payment is still being processed"
                })
            }
        }

        const deletedOrder = await orderModel.findOneAndDelete({
            _id: order._id,
            userId: req.user._id,
            paymentStatus: "pending"
        })

        if (!deletedOrder) {
            return res.status(409).json({
                message: "The order payment status changed. Refresh and try again."
            })
        }

        return res.status(200).json({
            message: "Pending order deleted successfully",
            orderId: deletedOrder._id
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function verifyEsewaPayment(req,res) {
    try {
        const payload=decodeAndVerifyCallback(req.body.data)

        if(!payload) return res.status(400).json({
            message :"Invalid payment"
        })

        const order =await orderModel.findOne({
            userId:req.user._id,
            esewaTransactionUuid:payload.transaction_uuid
        })

        if(!order) return res.status(400).json({
            message:"Order not found"
        })

        if(order.paymentStatus=="paid") return res.json(order)

        const status=await checkTransactionStatus({
        totalAmount:order.totalAmount,
        transactionUuid:order.esewaTransactionUuid
        })

        const isValid=
        payload.product_code==process.env.ESEWA_PRODUCT_CODE &&
        payload.status === "COMPLETE" &&
        status.status === "COMPLETE" &&
        Number(String(payload.total_amount).replace(/,/g, ""))===order.totalAmount


        if (!isValid) {
      console.error("eSewa payment not valid:", order._id, payload.status, status.status)
      return res.status(400).json({ message: "Payment could not be verified" })
    }
 
    const paidOrder = await orderModel.findOneAndUpdate(
      { _id: order._id, paymentStatus: "pending" },
      {
        paymentStatus: "paid",
        paidAt: new Date(),
        esewaRefId: status.ref_id || status.refId || payload.transaction_code
      },
      { new: true }
    )
   
    for(const item of order.items){
        const productId=item.productId
        await productModel.findByIdAndUpdate(productId,{$inc:{countInStock:-item.quantity}})
    }
    await cartModel.findOneAndUpdate({userId:req.user._id},{products:[]})

    res.status(200).json({
        message:"Payment Verfied",
        paidOrder
    })


    } catch (error) {
        res.status(500).json({
            error:error
        })
        
    }

    
}
async function getAllOrders(req,res) {
    try {
        const page =Math.max(parseInt(req.query.page)||1,1)
        const limit=Math.min(parseInt(req.query.limit)||10,100)
        const skip=(page-1)*limit
        const filter={}
        if (req.query.deliveryStatus) {
            filter.deliveryStatus=req.query.deliveryStatus
        }
        const [orders,total]=await Promise.all([
            orderModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId","name")
            .populate("items.productId","images")
            .lean()
            ,

            orderModel.countDocuments(filter)
        ])
        
        res.json({
            orders,
            page,
            limit,
            totalOrders: total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
          res.status(500).json({
            error:error
        })
        
        
    }
    
}
async function updateDeliveryStatus(req,res) {
    try {
        const orderId=req.params.id
        const { deliveryStatus } = req.body
        const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

        if (!allowedStatuses.includes(deliveryStatus)) {
            return res.status(400).json({ message: "Invalid delivery status" })
        }

        const updatedOrder=await orderModel.findByIdAndUpdate(
            orderId,
            { deliveryStatus },
            { new: true, runValidators: true }
        )

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.json(updatedOrder)
    } catch (error) {
        res.status(500).json({
            error:error
        })
    }
    
    
}

async function getAdminDashboardSummary(req, res) {
    try {
        const [productCount, orderCount, customerCount, revenueResult, pendingOrders, lowStockProducts, recentOrders, statusCounts] = await Promise.all([
            productModel.countDocuments(),
            orderModel.countDocuments(),
            userModel.countDocuments({ role: 'user' }),
            orderModel.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            orderModel.countDocuments({ deliveryStatus: 'pending' }),
            productModel.find({ countInStock: { $lte: 10 } })
                .sort({ countInStock: 1, updatedAt: -1 })
                .limit(5)
                .select('name sku countInStock price images')
                .lean(),
            orderModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name email')
                .populate('items.productId', 'images')
                .lean(),
            orderModel.aggregate([
                { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } }
            ])
        ])

        const ordersByStatus = statusCounts.reduce((result, item) => {
            result[item._id] = item.count
            return result
        }, {})

        res.json({
            metrics: {
                productCount,
                orderCount,
                customerCount,
                revenue: revenueResult[0]?.total || 0,
                pendingOrders
            },
            ordersByStatus,
            lowStockProducts,
            recentOrders
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports={getMyOrders,createOrder,resumePendingPayment,deletePendingOrder,verifyEsewaPayment,getAllOrders,updateDeliveryStatus,getAdminDashboardSummary}
