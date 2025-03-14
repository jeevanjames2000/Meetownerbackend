const express = require('express');
const router = express.Router();

const generalController = require('../controllers/generalController');

router.get('/getcities', generalController.getCities);
router.get('/getStates', generalController.getStates);
router.get('/getgoogleplaces', generalController.getGooglePlaces);
router.get('/getlocalitiesbycity', generalController.getLocalitiesByCity);
router.get('/getlocalitiesbycityname', generalController.getLocalitiesByCityName);
router.get('/getlocalitiesbycitynamenew', generalController.getLocalitiesByCityNamenew);

module.exports = router;