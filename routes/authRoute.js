const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.AuthLogin);
router.post('/register', authController.AuthRegister);
router.get('/sendOtp', authController.sendOtp);

module.exports = router;