const matchingService = require('../services/matchingService');
const EmergencyRequest = require('../models/EmergencyRequest');
const DonorMatch = require('../models/DonorMatch');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const findMatches = async (req, res) => {
  try {
    const { bloodGroup, componentType, latitude, longitude, radiusKm, urgency } = req.body;

    if (!bloodGroup || latitude === undefined || longitude === undefined) {
      return sendError(res, 'bloodGroup, latitude, and longitude are required.', 'VALIDATION_ERROR', 400);
    }

    const matches = await matchingService.findMatches({
      recipientBloodGroup: bloodGroup,
      componentType: componentType || 'WHOLE_BLOOD',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radiusKm: parseFloat(radiusKm || 15),
      urgency: urgency || 'HIGH',
    });

    return sendSuccess(res, 'Smart matching results retrieved.', matches);
  } catch (err) {
    return sendError(res, 'Matching calculation failed.', err.message, 500);
  }
};

const getRequestMatches = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      return sendError(res, 'Emergency request not found.', 'NOT_FOUND', 404);
    }

    const matches = await matchingService.findMatches({
      recipientBloodGroup: request.bloodGroup,
      componentType: request.componentType,
      latitude: request.latitude,
      longitude: request.longitude,
      radiusKm: request.currentRadius || 15,
      urgency: request.urgency,
    });

    return sendSuccess(res, 'Request matches calculated successfully.', matches);
  } catch (err) {
    return sendError(res, 'Failed to get request matches.', err.message, 500);
  }
};

const respondToMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { response, notes } = req.body;

    const match = await DonorMatch.findById(matchId);
    if (!match) {
      return sendError(res, 'Match record not found.', 'NOT_FOUND', 404);
    }

    match.response = response;
    match.matchStatus = response === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED';
    if (notes) match.responseNotes = notes;
    await match.save();

    return sendSuccess(res, 'Response recorded.', match);
  } catch (err) {
    return sendError(res, 'Failed to record response.', err.message, 400);
  }
};

module.exports = {
  findMatches,
  getRequestMatches,
  respondToMatch,
};
