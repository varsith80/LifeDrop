const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const EmergencyRequest = require('../models/EmergencyRequest');
const Donation = require('../models/Donation');
const AuditLog = require('../models/AuditLog');
const verificationService = require('../services/verificationService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getDashboardStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'DONOR' });
    const activeDonors = await DonorProfile.countDocuments({ availabilityStatus: 'AVAILABLE' });
    const totalRequests = await EmergencyRequest.countDocuments();
    const activeEmergencies = await EmergencyRequest.countDocuments({
      status: { $in: ['ACTIVE', 'MATCHING', 'PENDING_VERIFICATION', 'ACCEPTED', 'IN_PROGRESS'] },
    });
    const totalHospitals = await Hospital.countDocuments();
    const totalBloodBanks = await BloodBank.countDocuments();
    const successfulDonations = await Donation.countDocuments({ status: { $in: ['COMPLETED', 'CONFIRMED'] } });

    const pendingHospitalVerifications = await Hospital.countDocuments({ verificationStatus: 'PENDING' });
    const pendingBloodBankVerifications = await BloodBank.countDocuments({ verificationStatus: 'PENDING' });
    const totalPendingVerifications = pendingHospitalVerifications + pendingBloodBankVerifications;

    // Aggregations for charts:
    // 1. Emergency Requests by Blood Group
    const requestsByBloodGroup = await EmergencyRequest.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 2. Blood Availability by Group across all Blood Banks
    const bloodAvailability = await BloodInventory.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          availableUnits: { $sum: '$availableUnits' },
          reservedUnits: { $sum: '$reservedUnits' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Requests by Status / Fulfillment rate
    const statusCounts = await EmergencyRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const fulfilledCount = statusCounts.find((s) => s._id === 'FULFILLED')?.count || 0;
    const fulfillmentRate = totalRequests > 0 ? Math.round((fulfilledCount / totalRequests) * 100) : 0;

    // 4. Urgency distribution
    const urgencyDistribution = await EmergencyRequest.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } },
    ]);

    return sendSuccess(res, 'Admin dashboard statistics retrieved.', {
      metrics: {
        totalDonors,
        activeDonors,
        emergencyRequests: totalRequests,
        activeEmergencies,
        bloodBanks: totalBloodBanks,
        hospitals: totalHospitals,
        successfulDonations,
        pendingVerifications: totalPendingVerifications,
        fulfillmentRate,
      },
      charts: {
        requestsByBloodGroup,
        bloodAvailability,
        statusCounts,
        urgencyDistribution,
      },
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch admin stats.', err.message, 500);
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, 'Users list retrieved.', users);
  } catch (err) {
    return sendError(res, 'Failed to fetch users.', err.message, 500);
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updated = await verificationService.toggleUserStatus(id, req.user._id, Boolean(isActive));
    return sendSuccess(res, `User account ${isActive ? 'activated' : 'suspended'}.`, updated);
  } catch (err) {
    return sendError(res, 'Failed to toggle user status.', err.message, 400);
  }
};

const getPendingHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ verificationStatus: 'PENDING' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    return sendSuccess(res, 'Pending hospitals retrieved.', hospitals);
  } catch (err) {
    return sendError(res, 'Failed to fetch pending hospitals.', err.message, 500);
  }
};

const verifyHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'VERIFIED' } = req.body;
    const hospital = await verificationService.verifyHospital(id, req.user._id, status);
    return sendSuccess(res, `Hospital verification status updated to ${status}.`, hospital);
  } catch (err) {
    return sendError(res, 'Failed to verify hospital.', err.message, 400);
  }
};

const getPendingBloodBanks = async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ verificationStatus: 'PENDING' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    return sendSuccess(res, 'Pending blood banks retrieved.', bloodBanks);
  } catch (err) {
    return sendError(res, 'Failed to fetch pending blood banks.', err.message, 500);
  }
};

const verifyBloodBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'VERIFIED' } = req.body;
    const bloodBank = await verificationService.verifyBloodBank(id, req.user._id, status);
    return sendSuccess(res, `Blood bank verification status updated to ${status}.`, bloodBank);
  } catch (err) {
    return sendError(res, 'Failed to verify blood bank.', err.message, 400);
  }
};

const getAllEmergencyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find()
      .populate('hospitalId', 'hospitalName city')
      .populate('requesterId', 'name phone email')
      .populate('acceptedDonorId', 'name phone')
      .sort({ createdAt: -1 });
    return sendSuccess(res, 'All emergency requests retrieved.', requests);
  } catch (err) {
    return sendError(res, 'Failed to fetch emergency requests.', err.message, 500);
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    return sendSuccess(res, 'Audit logs retrieved.', logs);
  } catch (err) {
    return sendError(res, 'Failed to fetch audit logs.', err.message, 500);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getPendingHospitals,
  verifyHospital,
  getPendingBloodBanks,
  verifyBloodBank,
  getAllEmergencyRequests,
  getAuditLogs,
};
