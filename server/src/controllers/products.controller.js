const productModel=require("../models/products.model")
const {UploadAvatar,UploadProducts}=require("../config/cloudinary")
const userModel = require("../models/user.model")


async function newProduct(req,res) {
    const toNumber=(value)=>(value!==undefined && value!==''? Number(value):undefined )
    try {
        const {name,description,price,discountPrice,countInStock,sku,category,brand,sizes,colors,collections,material,gender,isFeatured,isPublished,rating,tags,dimensions,weight}=req.body
        const requriedFields={name,description,price,countInStock,sku,category,sizes,colors,collections}
        for(const [key,value] of Object.entries(requriedFields)){
            if (!value||(typeof value=="string" && !value.trim())) {
                return res.status(400).json({
                    message:`Missing required field ${key}`
                })  
            }
        }
        if (!req.files||req.files.length===0) {
            return res.status(400).json({
                message:"At least one image of the product is required"
            })
        }
        const uploadPromises=req.files.map(async(file)=>{
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`
            const imageURL=await UploadProducts(dataURI)
            return{
                url:imageURL,
                altText:file.originalname
            };

        })
        const imageObjects=await Promise.all(uploadPromises)
        const productData={
            name:name?.trim(),
            description:description?.trim(),
            price:toNumber(price),
            discountPrice:toNumber(discountPrice),
            countInStock:toNumber(countInStock),
            sku:sku?.trim(),
            category:category?.trim(),
            brand:brand?.trim(),
            sizes:typeof sizes === "string" ? sizes.split(",").map((s) => s.trim()) : sizes,
            colors:typeof colors === "string" ? colors.split(",").map((c) => c.trim()) : colors,
            collections:collections?.trim(),
            material,
            gender,
            images:imageObjects,
            isFeatured:isFeatured==="true"||isFeatured===true,
            isPublished:isPublished==="true"||isPublished===true,
            rating:toNumber(rating),
            tags: typeof tags==="string"? tags.split(",").map((t)=>t.trim()):tags,
            user:req.user._id,
            dimensions,
            weight
        }
        const product = await productModel.create(productData)
        res.status(201).json({
            message:"Product Registered Sucessfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
    
}
async function updateProduct(req,res) {
    try {
        const productId=req.params.id
        if (!productId) {
            return res.status(400).json({
                message:"Product ID is required"
            })
        }
        const {name,description,price,discountPrice,countInStock,sku,category,brand,sizes,colors,collections,material,gender,isFeatured,isPublished,rating,tags,dimensions,weight}=req.body
        const allFields={name,description,price,discountPrice,countInStock,sku,category,brand,sizes,colors,collections,material,gender,isFeatured,isPublished,rating,tags,dimensions,weight}
        console.log(name)
        let toUpdateData=[]
        for(let [key,value] of Object.entries(allFields)){
            if(value!==undefined  && value!==null){
                if (key=='sizes'||key=='colors'||key=='tags') {
                    value=typeof value === "string" ? sizes.split(",").map((s) => s.trim()) : value
                }
                if (key=="isFeatured"||key=="isPublished") {
                    value= value==="true"||value===true
                }
                toUpdateData.push([key,value])
            }
        }
        console.log(toUpdateData)
        toUpdateData=Object.fromEntries(toUpdateData)
        console.log(toUpdateData)
        if(req.files?.length>0){

            const uploadPromises=req.files.map(async(file)=>{
                    const b64 = Buffer.from(file.buffer).toString('base64');
                    const dataURI = `data:${file.mimetype};base64,${b64}`
                    const imageURL=await UploadProducts(dataURI)
                    return{
                        url:imageURL,
                        altText:file.originalname
                    };
        
                })
            const imageObjects=await Promise.all(uploadPromises)
            toUpdateData={...toUpdateData,images:imageObjects}
            console.log("image object is")
        }
        const updatedProduct= await productModel.findByIdAndUpdate(productId,toUpdateData,{
            returnDocument:"after"
        })
        if (!updatedProduct) {
            return res.status(404).json({
                message:"Product not found"
            })
        }
        res.status(200).json({
            message:"Product is updated sucessfully",
            updatedProduct
        })
    } catch (error) {
         res.status(500).json({
            error:error.message
        })  
    }       
}
async function  deleteProduct(req,res) {
    try {
        const productId=req.params.id
        const deletedProduct=await userModel.findByIdAndDelete(productId)
        res.status(200).json({
            message:"product deleted sucessfully",
            deletedProduct
        }) 
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
        
    }  
}
async function getProducts(req,res) {
    try {
        const {keywords,maxPrice,minPrice,category,brand,sizes,colors,collections,gender,isFeatured,isPublished,rating,tags}=req.query
        const page=Number(req.query.page)||1
        const limit=Number(req.query.limit)||10
        const skip=(page-1)*limit
        const dynamicQuery={}
        if (keywords) {
            dynamicQuery.$or=[
                {name:new RegExp(keywords.trim(),'i')},
                {description:new RegExp(keywords.trim(),'i')},
            ]
        }
     
        if(category) dynamicQuery.category=category
        if(brand){
            dynamicQuery.brand=brand
        }
        if(sizes) dynamicQuery.sizes=Array.isArray(sizes)?{$in:sizes}:{$in:sizes.split(',')}
        if(colors) dynamicQuery.colors=Array.isArray(colors)?{$in:colors}:{
            $in:colors.split(',')
        }
        if(collections) dynamicQuery.collections=Array.isArray(collections)?{$in:collections}:{$in:collections.split(',')}
        if(gender) dynamicQuery.gender=gender
        if(isFeatured) dynamicQuery.isFeatured=isFeatured==="true"||isFeatured===true
        if(isPublished) dynamicQuery.isPublished=isPublished==="true"||isPublished===true
        if(rating) dynamicQuery.rating=Number(rating)
        if(tags) dynamicQuery.tags=Array.isArray(tags)?{$in:tags}:{$in:tags.split(',')}
        if(minPrice||maxPrice){
            dynamicQuery.price={
            }
            if(minPrice) dynamicQuery.price.$gt=Number(minPrice)
            if(maxPrice) dynamicQuery.price.$lt=Number(maxPrice)
        }
        const [products,totalProducts]=await Promise.all([
            productModel.find(dynamicQuery).skip(skip).limit(limit),
            productModel.countDocuments(dynamicQuery)
        ])
    
        
        
        res.status(200).json({
            message:"Product Fetched Sucessfully",
            pagination:{
                totalProducts,
                totalPage:Math.ceil(totalProducts/limit),
                currentPage:page,
                limit
                
            },
            products
        })
  

    } catch (error) {
         res.status(500).json({
            error:error.message
        })
        
    }
    
}
async function getProductByid(req,res) {
    try {
        const productId=req.params.id
        if (!productId) {
            return res.status(400).json({
                message:"Product ID is required"
            })
        }
        const product = await productModel.findById(productId)
        res.status(200).json({
            message:"Product Fetched sucessfully",
            product
        })


    } catch (error) {
         res.status(500).json({
            error:error.message
        })
    }
    
}

module.exports={newProduct,updateProduct,deleteProduct,getProducts,getProductByid}