const config = require('config');
const jwt = require('jsonwebtoken');




module.exports = (req,res,next) => {
    token = req.header("x-auth-token")
    if (!token) return res.status(401).json({message: "Access denied. No token provided"})

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
        req.user = decoded
        console.log(req.user.isAdmin)
        
        next()
    } catch (ex) {
        res.status(400).json({message: "Invalid token"})

    }

  
} 