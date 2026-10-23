const { authMiddleWare } = require('../middleware/authMiddleware')
const { roleMiddleWare } = require('../middleware/roleMiddleware')
const {getMyOrders,createOrder,resumePendingPayment,deletePendingOrder,verifyEsewaPayment,getAllOrders,updateDeliveryStatus,getAdminDashboardSummary}=require("../controllers/order.controller")
const routes=require('express').Router()



routes.get('/my', authMiddleWare,getMyOrders)
routes.post('/',authMiddleWare,createOrder)
routes.post('/verify',authMiddleWare,verifyEsewaPayment)
routes.post('/:id/payment',authMiddleWare,resumePendingPayment)
routes.delete('/:id',authMiddleWare,deletePendingOrder)


routes.get('/admin',authMiddleWare,roleMiddleWare('admin'),getAllOrders)
routes.get('/admin/summary',authMiddleWare,roleMiddleWare('admin'),getAdminDashboardSummary)
routes.patch('/admin/:id/delivery',authMiddleWare,roleMiddleWare('admin'),updateDeliveryStatus)










module.exports=routes
