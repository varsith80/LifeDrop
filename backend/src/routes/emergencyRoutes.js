const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateEmergencyRequest } = require('../middleware/validationMiddleware');

// Public search of active emergency requests
router.get('/', emergencyController.getAllRequests);
router.get('/:id', emergencyController.getRequestById);
router.get('/:id/matches', emergencyController.getRequestMatches);

// Protected routes
router.use(authenticate);
router.post('/', validateEmergencyRequest, emergencyController.createRequest);
router.patch('/:id/status', emergencyController.updateStatus);
router.post('/:id/cancel', emergencyController.cancelRequest);
router.post('/:id/verify', emergencyController.verifyRequest);
router.post('/:id/escalate', emergencyController.escalate);

module.exports = router;
