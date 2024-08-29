const express = require('express')
const { userLogin, userRegister } = require('../controllers/userController')
const router = express.Router();

router.post('/login', userLogin);
router.post('/register', userRegister);

module.exports = router;