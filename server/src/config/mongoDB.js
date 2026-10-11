const mongoose = require("mongoose")

async function connectDB() {

    try {
        await mongoose.connect(process.env.Mongo_db_connection_string)
        console.log("Connected to mongoDB")
        
    } catch (error) {
        console.log(error)
    }
    
}
module.exports=connectDB