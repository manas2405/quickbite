const express = require('express');
const authMiddleware = require('../middleware/auth');
const { placeOrder, verifyOrder } = require('../controllers/OrderController');
const router = express.Router();


router.post('/place', authMiddleware, placeOrder);
router.post('/verify', authMiddleware, verifyOrder)
module.exports = router;