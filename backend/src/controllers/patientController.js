const EmergencyRequest = require('../models/EmergencyRequest');
const DonorMatch = require('../models/DonorMatch');
const emergencyService = require('../services/emergencyService');
const matchingService = require('../services/matchingService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const createEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      componentType,
      unitsRequired,
      hospitalId,
      urgency,
      requiredDate,
      requiredTime,
      location,
      latitude,
      longitude,
      additionalInformation,
    } = req.body;

    const result = await emergencyService.createRequest({
      requesterId: req.user._id,
      hospitalId,
      patientName: patientName || req.user.name,
      bloodGroup,
      componentType: componentType || 'WHOLE_BLOOD',
      unitsRequired: parseInt(unitsRequired, 10),
      urgency: urgency || 'HIGH',
      requiredDate,
      requiredTime,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      additionalInformation,
      ipAddress: req.ip || '127.0.0.1',
    });

    return sendSuccess(res, 'Emergency blood request created successfully.', result, 201);
  } catch (err) {
    if (err.code === 'DUPLICATE_REQUEST') {
      return sendError(res, err.message, 'DUPLICATE_REQUEST', 409);
    }
    return sendError(res, err.message || 'Failed to create emergency request.', 'REQUEST_CREATION_FAILED', 400);
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ requesterId: req.user._id })
      .populate('hospitalId', 'hospitalName address phone city')
      .populate('acceptedDonorId', 'name phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'My emergency blood requests retrieved.', requests);
  } catch (err) {
    return sendError(res, 'Failed to retrieve emergency requests.', err.message, 500);
  }
};

const getRequestTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EmergencyRequest.findById(id)
      .populate('hospitalId', 'hospitalName address phone city latitude longitude')
      .populate('acceptedDonorId', 'name phone profileImage');

    if (!request) {
      return sendError(res, 'Emergency request not found.', 'NOT_FOUND', 404);
    }

    // Get donor matches overview
    const matches = await DonorMatch.find({ requestId: id })
      .populate('donorId', 'name phone')
      .sort({ matchScore: -1 });

    // Step status timeline
    const timeline = [
      { step: 'REQUEST_CREATED', label: 'Request Created', completed: true, timestamp: request.createdAt },
      {
        step: 'HOSPITAL_VERIFIED',
        label: 'Medical Facility Verified',
        completed: ['VERIFIED', 'ACTIVE', 'MATCHING', 'ACCEPTED', 'IN_PROGRESS', 'FULFILLED'].includes(request.status),
      },
      {
        step: 'MATCHING_STARTED',
        label: 'Donor Proximity Matching',
        completed: ['MATCHING', 'ACCEPTED', 'IN_PROGRESS', 'FULFILLED'].includes(request.status),
      },
      {
        step: 'DONOR_FOUND',
        label: 'Compatible Donors Contacted',
        completed: matches.length > 0,
      },
      {
        step: 'DONOR_ACCEPTED',
        label: 'Donor Accepted & En Route',
        completed: ['ACCEPTED', 'IN_PROGRESS', 'FULFILLED'].includes(request.status),
      },
      {
        step: 'HOSPITAL_CONFIRMATION',
        label: 'Donor Arrival & Confirmation',
        completed: ['IN_PROGRESS', 'FULFILLED'].includes(request.status),
      },
      {
        step: 'REQUEST_FULFILLED',
        label: 'Blood Transfusion Fulfilled',
        completed: request.status === 'FULFILLED',
      },
    ];

    return sendSuccess(res, 'Request tracking details retrieved.', {
      request,
      timeline,
      matches,
      currentEscalationTier: request.escalationTier || 1,
      currentRadiusKm: request.currentRadius || 5,
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch request tracking.', err.message, 500);
  }
};

const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EmergencyRequest.findOne({ _id: id, requesterId: req.user._id });
    if (!request) {
      return sendError(res, 'Emergency request not found or unauthorized.', 'NOT_FOUND', 404);
    }

    request.status = 'CANCELLED';
    await request.save();

    return sendSuccess(res, 'Emergency request cancelled successfully.', request);
  } catch (err) {
    return sendError(res, 'Failed to cancel emergency request.', err.message, 500);
  }
};

module.exports = {
  createEmergencyRequest,
  getMyRequests,
  getRequestTracking,
  cancelRequest,
};
