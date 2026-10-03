const Hospital = require('../models/Hospital');
const EmergencyRequest = require('../models/EmergencyRequest');
const emergencyService = require('../services/emergencyService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getAllHospitals = async (req, res) => {
  try {
    const { city, verificationStatus } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    const hospitals = await Hospital.find(filter).sort({ hospitalName: 1 });
    return sendSuccess(res, 'Hospitals list retrieved.', hospitals);
  } catch (err) {
    return sendError(res, 'Failed to fetch hospitals.', err.message, 500);
  }
};

const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return sendError(res, 'Hospital not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Hospital details retrieved.', hospital);
  } catch (err) {
    return sendError(res, 'Failed to fetch hospital.', err.message, 500);
  }
};

const getMyHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return sendError(res, 'Hospital profile not found for this user.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Hospital profile retrieved.', hospital);
  } catch (err) {
    return sendError(res, 'Failed to fetch profile.', err.message, 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!hospital) {
      return sendError(res, 'Hospital profile not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Hospital profile updated successfully.', hospital);
  } catch (err) {
    return sendError(res, 'Failed to update hospital profile.', err.message, 400);
  }
};

const getHospitalRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return sendError(res, 'Hospital profile not found.', 'NOT_FOUND', 404);
    }

    const requests = await EmergencyRequest.find({ hospitalId: hospital._id })
      .populate('requesterId', 'name phone email')
      .populate('acceptedDonorId', 'name phone email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Hospital emergency requests retrieved.', requests);
  } catch (err) {
    return sendError(res, 'Failed to fetch requests.', err.message, 500);
  }
};

const verifyPatientRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved = true } = req.body;
    const updated = await emergencyService.verifyRequest(id, req.user._id, approved, req.ip);
    return sendSuccess(res, 'Request verification status updated.', updated);
  } catch (err) {
    return sendError(res, 'Verification failed.', err.message, 400);
  }
};

const confirmDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorId, unitsDonated = 1, componentType, notes } = req.body;

    if (!donorId) {
      return sendError(res, 'donorId is required to confirm donation.', 'VALIDATION_ERROR', 400);
    }

    const result = await emergencyService.confirmDonation({
      requestId: id,
      donorId,
      hospitalUserId: req.user._id,
      unitsDonated: parseInt(unitsDonated, 10),
      componentType: componentType || 'WHOLE_BLOOD',
      notes,
    });

    return sendSuccess(res, 'Donation successfully verified and recorded in platform.', result);
  } catch (err) {
    return sendError(res, 'Failed to confirm donation.', err.message, 400);
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  getMyHospitalProfile,
  updateProfile,
  getHospitalRequests,
  verifyPatientRequest,
  confirmDonation,
};
