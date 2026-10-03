const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateEmergencyRequest } = require('../middleware/validationMiddleware');

router.use(authenticate);

router.post('/requests', validateEmergencyRequest, patientController.createEmergencyRequest);
router.get('/requests', patientController.getMyRequests);
router.get('/requests/:id/tracking', patientController.getRequestTracking);
router.post('/requests/:id/cancel', patientController.cancelRequest);

module.exports = router;
