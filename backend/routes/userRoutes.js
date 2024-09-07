const express = require("express");
const router = express.Router();
const controllers = require("../controllers/UserControllers");

// Routes
router.post("/register",controllers.userregister);
router.post("/sendotp",controllers.userOtpSend);
router.post("/login",controllers.userLogin);


module.exports = router;