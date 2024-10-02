const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Login again" }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.body.userId = decoded.id; 
        next(); 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ success: false, message: "Invalid token" }); 
    }
}

module.exports = authMiddleware;
