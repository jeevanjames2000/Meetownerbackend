const express = require('express');
const router = express.Router();

const enquiresController = require('../controllers/enquiresController');

router.get('/getallenquires', enquiresController.getAllenquires);

module.exports = router;