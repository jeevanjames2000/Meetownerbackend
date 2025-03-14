const express = require('express');
const router = express.Router();

const backupDatainsertConroller = require('../controllers/backupDatainsertConroller');

// Apply multer middleware for handling file uploads before controller method
router.post("/states", backupDatainsertConroller.states);
router.post("/cities", backupDatainsertConroller.cities);
router.post("/areaunits", backupDatainsertConroller.areaunits);
router.post("/balconies", backupDatainsertConroller.balconies);
router.post("/bed_room_types", backupDatainsertConroller.bed_room_types);
router.post('/business_types', backupDatainsertConroller.business_types);
router.post('/company_details', backupDatainsertConroller.company_details);
router.post('/facilities', backupDatainsertConroller.facilities);
router.post('/facing', backupDatainsertConroller.facing);
router.post('/floors', backupDatainsertConroller.floors);
router.post('/furnished', backupDatainsertConroller.furnished);
router.post('/locations', backupDatainsertConroller.locations);
router.post('/occupancy', backupDatainsertConroller.occupancy);
router.post('/ownership_type', backupDatainsertConroller.ownership_type);
router.post('/properties', backupDatainsertConroller.properties);
router.post('/properties_gallery', backupDatainsertConroller.properties_gallery);
router.post('/property_for', backupDatainsertConroller.property_for);
router.post('/property_in', backupDatainsertConroller.property_in);
router.post('/sub_types', backupDatainsertConroller.sub_types);
router.post('/transaction_type', backupDatainsertConroller.transaction_type);
router.post('/types', backupDatainsertConroller.types);
router.post('/user_types', backupDatainsertConroller.user_types);
router.post('/zone_types', backupDatainsertConroller.zone_types);
router.post('/searched_properties', backupDatainsertConroller.searched_properties);
router.post('/contact_seller', backupDatainsertConroller.contact_seller);
module.exports = router;
