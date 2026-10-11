const app = require("./src/app")
const connectDB=require("./src/config/mongoDB")
const dns =require('dns')
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
connectDB()
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at port ${process.env.PORT}`)
})