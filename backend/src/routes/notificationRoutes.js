const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.post('/register-token', notificationController.registerPushToken);

module.exports = router;
