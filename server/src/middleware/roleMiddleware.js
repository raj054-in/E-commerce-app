
function roleMiddleWare(requiredRole) {
    return (req,res,next) => {
        try {
            if(!req.user){
                return res.status(401).json({
                    message:"Unauthorized"
                })
            }
            if (req.user.role!==requiredRole) {
                 return res.status(403).json({ message: "Forbidden: insufficient privileges" });
                
            }
            next()
            
        } catch (error) {
            res.status(500).json({
                error:error.message
            })
            
        }
        
    }
    
}
module.exports={roleMiddleWare}