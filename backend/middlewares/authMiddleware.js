import { verifyAccessToken } from "../utils/tokenUtils.js"


export const authenticate = async (req, res, next) => {
    try {
        console.log("hit authenticate");
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            })
        }
        const token = authHeader.split(' ')[1]
        const decoded = verifyAccessToken(token)
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            })
        }
        req.user = decoded
        console.log("Authenticated user:", req.user);
        next()
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Error in auth middleware"
        })
    }
}

export const authorize = (...roles) => {
    return (req,res,next) => {
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Not authenticated"
            })
        }
        const allowedRoles = roles.flat() // Flatten in case of authorize(['creator', 'admin'])
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"Unauthorized: Insufficient permissions"
            })
        }
        next()
    }
}