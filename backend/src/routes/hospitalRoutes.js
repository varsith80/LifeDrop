const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public lookup
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);

// Hospital staff routes
router.use(authenticate);
router.get('/my/profile', hospitalController.getMyHospitalProfile);
router.put('/profile', authorizeRoles('HOSPITAL', 'ADMIN'), hospitalController.updateProfile);
router.get('/my/requests', authorizeRoles('HOSPITAL', 'ADMIN'), hospitalController.getHospitalRequests);
router.post('/requests/:id/verify', authorizeRoles('HOSPITAL', 'ADMIN'), hospitalController.verifyPatientRequest);
router.post('/requests/:id/confirm-donation', authorizeRoles('HOSPITAL', 'ADMIN'), hospitalController.confirmDonation);

module.exports = router;
