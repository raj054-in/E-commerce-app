const {authMiddleWare}=require('../middleware/authMiddleware')
const {getCart,addToCart,updateCart,removeItem,clearCart}=require('../controllers/cart.controller')
const routes=require('express').Router()


routes.get('/',authMiddleWare,getCart)
routes.post('/',authMiddleWare,addToCart)
routes.patch('/',authMiddleWare,updateCart)
routes.delete('/',authMiddleWare,clearCart)
routes.delete('/:id',authMiddleWare,removeItem)

module.exports=routes
