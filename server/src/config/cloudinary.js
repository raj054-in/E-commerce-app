const cloudinary =require('cloudinary').v2

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true
})

async function UploadAvatar(dataURI) {
    try {
        const upload = await cloudinary.uploader.upload(dataURI,{
            folder:"EcommerceAppAvatar",
            resource_type:"image",
            transformation: [
        { width: 1000, height: 1000, crop: "limit" }, // Resizes massive camera photos down to max 1000px
        { quality: "auto", fetch_format: "auto" },    // Automatically compresses & converts to WebP/AVIF
        ],
            
        })
        return upload.secure_url
        
    } catch (error) {
        console.log("Error while uploading avatar to the cloudinar" , error)
        throw new Error('Error while uploading avatar to the cloudinary')
    }
}
async function UploadProducts(dataURI) {
    try {
        const upload = await cloudinary.uploader.upload(dataURI,{
            folder:"EcommerceProducts",
            resource_type:"image",
            transformation: [
        { width: 1000, height: 1000, crop: "limit" }, // Resizes massive camera photos down to max 1000px
        { quality: "auto", fetch_format: "auto" },    // Automatically compresses & converts to WebP/AVIF
        ],
            
        })
        return upload.secure_url
        
    } catch (error) {
        console.log("Error while uploading avatar to the cloudinar" , error)
        throw new Error('Error while uploading avatar to the cloudinary')
    }

    
}
module.exports={UploadAvatar,UploadProducts}