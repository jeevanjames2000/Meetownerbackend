const express = require('express');
const router = express.Router();

const listingsController = require('../controllers/listingsController');

router.get('/getalllistings', listingsController.getAllListings);
router.get('/propertiesCount', listingsController.propertiesCount);
router.get('/getpropertydetails', listingsController.getAllProperties);
router.get('/getlatestproperties', listingsController.getLatestProperties);
router.get('/getallpropertiesnew', listingsController.getAllPropertiesnew);
router.get('/getsingleproperty', listingsController.getSingleProperty);

module.exports = router;