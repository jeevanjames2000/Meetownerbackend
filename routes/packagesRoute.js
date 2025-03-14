const express = require("express");
const router = express.Router();

const packagesController = require("../controllers/packagesController");

router.get("/forselltab", packagesController.getAllSellPackages);
router.get("/forrenttab", packagesController.getAllRentPackages);
router.get("/forcommercial", packagesController.getAllCommercialsPackages);

module.exports = router;
