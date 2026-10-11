
require('dotenv').config()
const products=require("./seed/product")
const userModel=require('./src/models/user.model')
const productModel = require('./src/models/products.model')
const mongoose=require('mongoose')
const dns =require('dns')
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
try {
         mongoose.connect(process.env.Mongo_db_connection_string)
        console.log("Connect to mongoDB")
        
    } catch (error) {
        console.log(error)
    }

const seedData= async ()=>{
    try {
        await productModel.deleteMany()
        await userModel.deleteMany()
        const user= await userModel.create({
            name:"Raj Kr Singh",
            email:"rajsingh@email.com",
            password:"123@Raja",
            role:"admin"
        })
        const userId=user._id
        const sampleProduct=products.map((product)=>({
            ...product,user:userId
        }))
        const seedProduct= await productModel.insertMany(sampleProduct)

        console.log("Product Seeded")
        process.exit(0)
    } catch (error) {
        console.log("Error while seeding Prduct", error)
        process.exit(1)
        
    }
}
seedData()
