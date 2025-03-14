const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/usertypes', userController.getUsertypes);
router.get('/userdetails', userController.getUserDetails);
router.post('/updateUserDetails', userController.updateUserDetails);
router.post('/updateUserPhoto', userController.updateUserPhoto);
router.post('/updateuserphotomain', userController.updateUserPhotomain);

module.exports = router;