require("dotenv").config()
const express =require("express")
const cookieParser = require("cookie-parser")
const cors=require('cors')
const app = express()
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

const authRoutes = require('../src/routes/auth.routes')
const productRoutes=require('../src/routes/product.routes')
const cartRoutes=require('../src/routes/cart.routes')
const orderRoutes=require('../src/routes/order.routes')

app.use("/api/auths" , authRoutes)
app.use("/api/products",productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/carts',cartRoutes)


module.exports=app