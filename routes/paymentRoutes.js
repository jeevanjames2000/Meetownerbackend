const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentsController");

router.post("/createOrder", paymentController.createOrder);
router.post("/verifyPayment", paymentController.verifyPayment);
module.exports = router;
