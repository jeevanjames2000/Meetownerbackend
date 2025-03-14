const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const mainController = require("../controllers/mainController");
const verifyToken = require("../middleware/verifyToken");
const middleWare = verifyToken.verifyToken;

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get("/sample", middleWare, authController.sample);
router.post("/sendOTP", authController.sendOtp);
router.post("/logout", authController.logout);
router.get("/getPlaces", mainController.getGooglePlaces);
router.get("/forselltab", mainController.getAllSellPackages);
router.get("/forrenttab", mainController.getAllRentPackages);
router.get("/forcommercial", mainController.getAllCommercialsPackages);

// router.get("/", mainController.sample);

module.exports = router;
