const { authMiddleWare } = require('../middleware/authMiddleware')
const { roleMiddleWare } = require('../middleware/roleMiddleware')
const{newProduct, updateProduct, deleteProduct, getProducts, getProductByid }=require('../controllers/products.controller')
const multer=require('multer')
const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        console.log('Received file:', file.originalname, '| MIME:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null,true)
            
        } else {
            cb(new Error('Only JPG, PNG, or WEBP image formats are allowed!'), false);
            
        }

    }

})
const routes= require('express').Router()

//to register the new product
routes.post('/',authMiddleWare,roleMiddleWare("admin"),upload.array("productImage",10),newProduct)
//to update the products or change something in the product 
routes.patch('/:id',authMiddleWare,roleMiddleWare("admin"),upload.array("productImage",10),updateProduct)
//to delete the selected product 
routes.delete('/:id',authMiddleWare,roleMiddleWare("admin"),deleteProduct)
//to get the products with filters 
routes.get("/",getProducts)
// to get the single product 
routes.get("/:id",getProductByid)
module.exports=routes
