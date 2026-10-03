const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBankController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public directory & inventory browsing
router.get('/', bloodBankController.getAllBloodBanks);
router.get('/:id', bloodBankController.getBloodBankById);
router.get('/:id/inventory', bloodBankController.getInventory);

// Protected routes for blood bank staff & admins
router.use(authenticate);
router.get('/my/profile', bloodBankController.getMyBloodBank);
router.post('/:id/inventory', authorizeRoles('BLOOD_BANK', 'ADMIN'), bloodBankController.addInventoryItem);
router.put('/:id/inventory/:inventoryId', authorizeRoles('BLOOD_BANK', 'ADMIN'), bloodBankController.updateInventoryItem);
router.delete('/:id/inventory/:inventoryId', authorizeRoles('BLOOD_BANK', 'ADMIN'), bloodBankController.deleteInventoryItem);

module.exports = router;
