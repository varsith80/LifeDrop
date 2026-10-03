const BloodBank = require('../models/BloodBank');
const bloodBankService = require('../services/bloodBankService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllBloodBanks = async (req, res) => {
  try {
    const { city, verificationStatus } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    const bloodBanks = await bloodBankService.getAllBloodBanks(filter);
    return sendSuccess(res, 'Blood banks list retrieved.', bloodBanks);
  } catch (err) {
    return sendError(res, 'Failed to fetch blood banks.', err.message, 500);
  }
};

const getBloodBankById = async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return sendError(res, 'Blood bank not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Blood bank details retrieved.', bloodBank);
  } catch (err) {
    return sendError(res, 'Failed to fetch blood bank.', err.message, 500);
  }
};

const getMyBloodBank = async (req, res) => {
  try {
    const bloodBank = await bloodBankService.getBloodBankByUserId(req.user._id);
    if (!bloodBank) {
      return sendError(res, 'Blood bank profile not found.', 'NOT_FOUND', 404);
    }
    const inventory = await bloodBankService.getInventory(bloodBank._id);
    return sendSuccess(res, 'Blood bank profile & inventory retrieved.', { bloodBank, inventory });
  } catch (err) {
    return sendError(res, 'Failed to fetch blood bank data.', err.message, 500);
  }
};

const getInventory = async (req, res) => {
  try {
    const inventory = await bloodBankService.getInventory(req.params.id);
    return sendSuccess(res, 'Blood inventory retrieved.', inventory);
  } catch (err) {
    return sendError(res, 'Failed to fetch blood inventory.', err.message, 500);
  }
};

const addInventoryItem = async (req, res) => {
  try {
    const item = await bloodBankService.createInventoryItem(req.params.id, req.body, req.user._id);
    return sendSuccess(res, 'Inventory item added successfully.', item, 201);
  } catch (err) {
    return sendError(res, 'Failed to add inventory item.', err.message, 400);
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id, inventoryId } = req.params;
    const item = await bloodBankService.updateInventoryItem(id, inventoryId, req.body, req.user._id);
    return sendSuccess(res, 'Inventory item updated successfully.', item);
  } catch (err) {
    return sendError(res, 'Failed to update inventory item.', err.message, 400);
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const { id, inventoryId } = req.params;
    await bloodBankService.removeInventoryItem(id, inventoryId);
    return sendSuccess(res, 'Inventory item deleted successfully.');
  } catch (err) {
    return sendError(res, 'Failed to delete inventory item.', err.message, 400);
  }
};

module.exports = {
  getAllBloodBanks,
  getBloodBankById,
  getMyBloodBank,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
