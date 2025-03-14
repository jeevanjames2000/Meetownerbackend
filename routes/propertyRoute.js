const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/propertyController');

router.post('/addbasicdetails', propertyController.addBasicdetails);
router.get('/getbasicdetails', propertyController.getBasicdetails);
router.post('/addproertydetails', propertyController.addPropertyDetails);
router.get('/getpropertydetails', propertyController.getPropertyDetails);
router.post('/addAddressdetails', propertyController.addAddressDetails);
router.get('/getAddressdetails', propertyController.getAddressDetails);
router.get('/getsinglepropertydetails', propertyController.getSinglePropertyDetails);
router.post('/addphotosvideos', propertyController.addPhotosVideos);
router.post('/addpropertyfloorplans', propertyController.addFloorplans)
router.get('/getpropertyphotos', propertyController.getPhotos);
router.get('/getfloorplansphotos', propertyController.getFloorplansPhotos)
router.post('/deletePropertyPhoto', propertyController.deletePropertyPhoto);
router.post('/deletepropertyfloorplan', propertyController.deleteFloorplanPhoto);
router.get('/getpropertyvideos', propertyController.getPropertyVideos);
router.post('/deletePropertyVideo', propertyController.deletePropertyVideo);
router.post('/deleteProperty', propertyController.deleteProperty);
router.get('/getpropertysubtypes', propertyController.getPropertySubType);
router.get('/getpreferedtenanttypes', propertyController.getPreferedTenantTypes);
router.get('/getbaclonies', propertyController.getBalcanies);
router.get('/getbedroomtypes', propertyController.getBedroomTypes);
router.get('/getbusinesstypes', propertyController.getBusinessTypes);
router.get('/getfaclities', propertyController.getFaclities);
router.get('/getfacing', propertyController.getFacing);
router.get('/getfloors', propertyController.getFloors);
router.get('/getFurnishedStatus', propertyController.getFurnishedStatus);
router.get('/getOccupancy', propertyController.getOccupancy);
router.get('/getOwnerShipType', propertyController.getOwnerShipType);
router.get('/getPropertyFor', propertyController.getPropertyFor);
router.get('/getPropertyIn', propertyController.getPropertyIn);
router.get('/getTransactionType', propertyController.getTransactionType);
router.get('/getZoneTypes', propertyController.getZoneTypes);
router.get('/getprojects', propertyController.getProjects);
router.post('/deleteplacesaroundproperty', propertyController.deleteplacesaroundproperty);
router.post('/propertywithoutphotos', propertyController.propertyWithoutPhotos);
router.get('/getareaunits', propertyController.getAreaunits);

module.exports = router;