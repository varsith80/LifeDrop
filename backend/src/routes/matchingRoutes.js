const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/find', matchingController.findMatches);
router.get('/request/:requestId', matchingController.getRequestMatches);

router.use(authenticate);
router.post('/:matchId/respond', matchingController.respondToMatch);

module.exports = router;
