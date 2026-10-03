const donorService = require('../services/donorService');
const emergencyService = require('../services/emergencyService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getProfile = async (req, res) => {
  try {
    const profile = await donorService.getProfile(req.user._id);
    if (!profile) {
      return sendError(res, 'Donor profile not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Donor profile retrieved.', profile);
  } catch (err) {
    return sendError(res, 'Failed to fetch donor profile.', err.message, 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await donorService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, 'Donor profile updated successfully.', updated);
  } catch (err) {
    return sendError(res, 'Failed to update donor profile.', err.message, 400);
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 'Availability status is required.', 'VALIDATION_ERROR', 400);
    }
    const updated = await donorService.setAvailability(req.user._id, status);
    return sendSuccess(res, `Availability updated to ${status}.`, updated);
  } catch (err) {
    return sendError(res, 'Failed to update availability status.', err.message, 400);
  }
};

const getEmergencyRequests = async (req, res) => {
  try {
    const requests = await donorService.getEmergencyRequests(req.user._id);
    return sendSuccess(res, 'Relevant emergency blood requests retrieved.', requests);
  } catch (err) {
    return sendError(res, 'Failed to retrieve emergency requests.', err.message, 500);
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const result = await emergencyService.acceptRequest(id, req.user._id, notes);
    return sendSuccess(res, 'Emergency request accepted successfully. The hospital has been notified.', result);
  } catch (err) {
    return sendError(res, err.message || 'Failed to accept request.', err.code || 'ACCEPT_ERROR', err.statusCode || 400);
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { relay = true } = req.body;
    const result = await emergencyService.rejectRequest(id, req.user._id, relay);
    return sendSuccess(res, 'Request response recorded. Relay process initiated if applicable.', result);
  } catch (err) {
    return sendError(res, 'Failed to process request response.', err.message, 400);
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await donorService.getDonationHistory(req.user._id);
    return sendSuccess(res, 'Donation history retrieved.', donations);
  } catch (err) {
    return sendError(res, 'Failed to retrieve donation history.', err.message, 500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateAvailability,
  getEmergencyRequests,
  acceptRequest,
  rejectRequest,
  getDonations,
};
