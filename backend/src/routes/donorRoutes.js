const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/profile', donorController.getProfile);
router.put('/profile', donorController.updateProfile);
router.patch('/availability', donorController.updateAvailability);
router.get('/emergency-requests', donorController.getEmergencyRequests);
router.post('/requests/:id/accept', donorController.acceptRequest);
router.post('/requests/:id/reject', donorController.rejectRequest);
router.get('/donations', donorController.getDonations);

module.exports = router;
