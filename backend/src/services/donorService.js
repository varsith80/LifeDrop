const DonorProfile = require('../models/DonorProfile');
const Donation = require('../models/Donation');
const DonorMatch = require('../models/DonorMatch');
const EmergencyRequest = require('../models/EmergencyRequest');
const AuditLog = require('../models/AuditLog');
const { isBloodCompatible, MEDICAL_SAFETY_DISCLAIMER } = require('../utils/bloodCompatibility');
const { calculateDistance } = require('../utils/distanceCalculator');

class DonorService {
  async getProfile(userId) {
    let profile = await DonorProfile.findOne({ userId }).populate('userId', 'name email phone role profileImage isVerified isActive');
    if (!profile) {
      return null;
    }
    const eligibility = this.calculateEligibility(profile.lastDonationDate);
    return {
      ...profile.toObject(),
      eligibility,
      medicalDisclaimer: MEDICAL_SAFETY_DISCLAIMER,
    };
  }

  async updateProfile(userId, updateData) {
    const allowed = [
      'bloodGroup',
      'dateOfBirth',
      'gender',
      'location',
      'latitude',
      'longitude',
      'preferredRadius',
      'notificationEnabled',
    ];

    const filtered = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        filtered[key] = updateData[key];
      }
    }

    const updated = await DonorProfile.findOneAndUpdate(
      { userId },
      { $set: filtered },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone role profileImage isVerified isActive');

    return updated;
  }

  async setAvailability(userId, availabilityStatus) {
    const valid = ['AVAILABLE', 'AVAILABLE_LATER', 'UNAVAILABLE'];
    if (!valid.includes(availabilityStatus)) {
      throw new Error(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }

    const profile = await DonorProfile.findOneAndUpdate(
      { userId },
      { availabilityStatus },
      { new: true }
    );

    await AuditLog.create({
      userId,
      action: 'Availability Updated',
      entityType: 'DonorProfile',
      entityId: profile ? profile._id.toString() : null,
      metadata: { newStatus: availabilityStatus },
    });

    return profile;
  }

  calculateEligibility(lastDonationDate) {
    const COOLDOWN_DAYS = 90;
    if (!lastDonationDate) {
      return {
        status: 'ELIGIBLE',
        daysSinceLastDonation: null,
        daysRemaining: 0,
        nextEligibleDate: new Date(),
        message: 'Eligible to donate blood.',
      };
    }

    const now = new Date();
    const lastDate = new Date(lastDonationDate);
    const diffMs = now - lastDate;
    const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, COOLDOWN_DAYS - daysSince);

    const nextDate = new Date(lastDate.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

    return {
      status: daysRemaining === 0 ? 'ELIGIBLE' : 'COOLDOWN',
      daysSinceLastDonation: daysSince,
      daysRemaining,
      nextEligibleDate: nextDate,
      message:
        daysRemaining === 0
          ? 'Eligible to donate blood.'
          : `Donation cooldown active. Next eligible date: ${nextDate.toISOString().split('T')[0]} (${daysRemaining} days remaining).`,
    };
  }

  async getEmergencyRequests(userId) {
    const profile = await DonorProfile.findOne({ userId });
    if (!profile) return [];

    // Query active emergency requests
    const activeRequests = await EmergencyRequest.find({
      status: { $in: ['ACTIVE', 'MATCHING', 'PENDING_VERIFICATION'] },
      expiresAt: { $gt: new Date() },
    }).populate('hospitalId', 'hospitalName address phone city');

    const relevant = [];
    for (const req of activeRequests) {
      // Compatibility check
      if (!isBloodCompatible(profile.bloodGroup, req.bloodGroup, req.componentType)) {
        continue;
      }

      // Proximity check
      const dist = calculateDistance(profile.latitude, profile.longitude, req.latitude, req.longitude);
      if (dist <= (req.currentRadius || 20)) {
        // Check if user already responded
        const match = await DonorMatch.findOne({ requestId: req._id, donorId: userId });

        relevant.push({
          request: req,
          distance: dist,
          matchStatus: match ? match.matchStatus : 'AVAILABLE',
          response: match ? match.response : null,
          isExactMatch: profile.bloodGroup === req.bloodGroup,
        });
      }
    }

    relevant.sort((a, b) => a.distance - b.distance);
    return relevant;
  }

  async getDonationHistory(userId) {
    return Donation.find({ donorId: userId })
      .populate('hospitalId', 'hospitalName address city')
      .populate('bloodBankId', 'name address city')
      .populate('requestId', 'bloodGroup unitsRequired patientName')
      .sort({ donationDate: -1 });
  }
}

module.exports = new DonorService();
