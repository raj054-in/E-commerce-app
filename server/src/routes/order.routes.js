const { authMiddleWare } = require('../middleware/authMiddleware')
const { roleMiddleWare } = require('../middleware/roleMiddleware')
const {getMyOrders,createOrder,verifyEsewaPayment,getAllOrders,updateDeliveryStatus}=require("../controllers/order.controller")
const routes=require('express').Router()



routes.get('/my', authMiddleWare,getMyOrders)
routes.post('/',authMiddleWare,createOrder)
routes.post('/verify',authMiddleWare,verifyEsewaPayment)


routes.get('/admin',authMiddleWare,roleMiddleWare('admin'),getAllOrders)
routes.patch('/admin/:id/delivery',authMiddleWare,roleMiddleWare('admin'),updateDeliveryStatus)










module.exports=routes
