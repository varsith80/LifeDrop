const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.get('/hospitals/pending', adminController.getPendingHospitals);
router.patch('/hospitals/:id/verify', adminController.verifyHospital);
router.get('/blood-banks/pending', adminController.getPendingBloodBanks);
router.patch('/blood-banks/:id/verify', adminController.verifyBloodBank);
router.get('/emergency-requests', adminController.getAllEmergencyRequests);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
