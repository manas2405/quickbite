const express = require('express');
const authMiddleware = require('../middleware/auth');
const { placeOrder } = require('../controllers/OrderController');
const router = express.Router();


router.post('/place', authMiddleware, placeOrder);
module.exports = router;