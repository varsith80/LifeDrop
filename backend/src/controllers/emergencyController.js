const EmergencyRequest = require('../models/EmergencyRequest');
const DonorMatch = require('../models/DonorMatch');
const emergencyService = require('../services/emergencyService');
const matchingService = require('../services/matchingService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const createRequest = async (req, res) => {
  try {
    const result = await emergencyService.createRequest({
      ...req.body,
      requesterId: req.user._id,
      ipAddress: req.ip || '127.0.0.1',
    });
    return sendSuccess(res, 'Emergency request created successfully.', result, 201);
  } catch (err) {
    if (err.code === 'DUPLICATE_REQUEST') {
      return sendError(res, err.message, 'DUPLICATE_REQUEST', 409);
    }
    return sendError(res, err.message, 'CREATION_ERROR', err.statusCode || 400);
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { bloodGroup, status, urgency, hospitalId } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (hospitalId) filter.hospitalId = hospitalId;

    const requests = await EmergencyRequest.find(filter)
      .populate('hospitalId', 'hospitalName city phone')
      .populate('requesterId', 'name phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Emergency requests retrieved.', requests);
  } catch (err) {
    return sendError(res, 'Failed to fetch emergency requests.', err.message, 500);
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate('hospitalId', 'hospitalName address city phone state latitude longitude')
      .populate('requesterId', 'name phone email')
      .populate('acceptedDonorId', 'name phone email');

    if (!request) {
      return sendError(res, 'Emergency request not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Emergency request retrieved.', request);
  } catch (err) {
    return sendError(res, 'Failed to fetch emergency request.', err.message, 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'DRAFT',
      'PENDING_VERIFICATION',
      'VERIFIED',
      'ACTIVE',
      'MATCHING',
      'ACCEPTED',
      'IN_PROGRESS',
      'FULFILLED',
      'CANCELLED',
      'EXPIRED',
    ];

    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 'INVALID_STATUS', 400);
    }

    const request = await EmergencyRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) {
      return sendError(res, 'Emergency request not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, `Status updated to ${status}.`, request);
  } catch (err) {
    return sendError(res, 'Failed to update status.', err.message, 400);
  }
};

const cancelRequest = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Emergency request not found.', 'NOT_FOUND', 404);
    }

    request.status = 'CANCELLED';
    await request.save();

    return sendSuccess(res, 'Emergency request cancelled successfully.', request);
  } catch (err) {
    return sendError(res, 'Failed to cancel emergency request.', err.message, 400);
  }
};

const verifyRequest = async (req, res) => {
  try {
    const { approved = true } = req.body;
    const updated = await emergencyService.verifyRequest(req.params.id, req.user._id, approved, req.ip);
    return sendSuccess(res, 'Request verification status updated.', updated);
  } catch (err) {
    return sendError(res, 'Verification failed.', err.message, 400);
  }
};

const getRequestMatches = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);
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

    return sendSuccess(res, 'Matched sources retrieved.', matches);
  } catch (err) {
    return sendError(res, 'Failed to retrieve matches.', err.message, 500);
  }
};

const escalate = async (req, res) => {
  try {
    const escalated = await emergencyService.escalateRequest(req.params.id);
    if (!escalated) {
      return sendError(res, 'Unable to escalate request.', 'ESCALATION_FAILED', 400);
    }
    return sendSuccess(res, `Request escalated to radius ${escalated.currentRadius} km (Tier ${escalated.escalationTier}).`, escalated);
  } catch (err) {
    return sendError(res, 'Escalation failed.', err.message, 500);
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateStatus,
  cancelRequest,
  verifyRequest,
  getRequestMatches,
  escalate,
};
