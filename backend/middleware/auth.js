const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({sucess: false, message: "Login again" });
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.body.userId = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.json({sucess: false, message: "Error" });
    }
}

module.exports = authMiddleware;