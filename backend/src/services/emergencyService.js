const EmergencyRequest = require('../models/EmergencyRequest');
const DonorMatch = require('../models/DonorMatch');
const DonorProfile = require('../models/DonorProfile');
const Donation = require('../models/Donation');
const Hospital = require('../models/Hospital');
const AuditLog = require('../models/AuditLog');
const matchingService = require('./matchingService');
const notificationService = require('./notificationService');

class EmergencyService {
  /**
   * Check for duplicate active requests to prevent spam or accidental double submissions.
   */
  async checkDuplicate({ requesterId, hospitalId, bloodGroup }) {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const existing = await EmergencyRequest.findOne({
      requesterId,
      hospitalId,
      bloodGroup,
      status: {
        $in: ['PENDING_VERIFICATION', 'VERIFIED', 'ACTIVE', 'MATCHING', 'ACCEPTED', 'IN_PROGRESS'],
      },
      createdAt: { $gte: twelveHoursAgo },
    });

    return existing;
  }

  /**
   * Create an emergency blood request.
   */
  async createRequest({
    requesterId,
    hospitalId,
    patientName,
    bloodGroup,
    componentType = 'WHOLE_BLOOD',
    unitsRequired,
    urgency = 'HIGH',
    requiredDate,
    requiredTime,
    location,
    latitude,
    longitude,
    additionalInformation = '',
    validityHours = 24,
    ipAddress = '127.0.0.1',
  }) {
    // 1. Check for duplicates
    const duplicate = await this.checkDuplicate({ requesterId, hospitalId, bloodGroup });
    if (duplicate) {
      const err = new Error(
        `A similar active emergency request (${duplicate._id}) already exists for this hospital and blood group.`
      );
      err.statusCode = 409;
      err.code = 'DUPLICATE_REQUEST';
      err.existingRequestId = duplicate._id;
      throw err;
    }

    const expiresAt = new Date(Date.now() + validityHours * 60 * 60 * 1000);

    // 2. Create the request in DB
    const request = await EmergencyRequest.create({
      requesterId,
      hospitalId,
      patientName: patientName || 'Emergency Patient',
      bloodGroup,
      componentType,
      unitsRequired,
      urgency,
      requiredDate,
      requiredTime,
      location,
      latitude,
      longitude,
      additionalInformation,
      status: 'MATCHING',
      verificationStatus: 'PENDING',
      currentRadius: 5, // Start at 5km
      escalationTier: 1,
      expiresAt,
    });

    // 3. Log Audit trail
    await AuditLog.create({
      userId: requesterId,
      action: 'Request Created',
      entityType: 'EmergencyRequest',
      entityId: request._id.toString(),
      metadata: { bloodGroup, unitsRequired, urgency, location },
      ipAddress,
    });

    // 4. Initial Matching
    const matches = await matchingService.findMatches({
      recipientBloodGroup: bloodGroup,
      componentType,
      latitude,
      longitude,
      radiusKm: 5,
      urgency,
    });

    // 5. Create DonorMatch records and notify donors
    for (const donor of matches.donors) {
      await DonorMatch.findOneAndUpdate(
        { requestId: request._id, donorId: donor.donorId },
        {
          requestId: request._id,
          donorId: donor.donorId,
          matchScore: donor.score,
          distance: donor.distance,
          matchStatus: 'NOTIFIED',
          notificationStatus: 'SENT',
        },
        { upsert: true, new: true }
      );

      await notificationService.notifyUser({
        userId: donor.donorId,
        requestId: request._id,
        type: 'EMERGENCY_REQUEST',
        title: `🚨 Emergency Blood Need: ${bloodGroup}`,
        message: `Emergency request for ${bloodGroup} blood at ${location} (~${donor.distance} km away). Urgency: ${urgency}.`,
        metadata: {
          requestId: request._id,
          bloodGroup,
          unitsRequired,
          distance: donor.distance,
          score: donor.score,
        },
      });
    }

    // 6. Notify Hospital of new request
    const hospital = await Hospital.findById(hospitalId);
    if (hospital && hospital.userId) {
      await notificationService.notifyUser({
        userId: hospital.userId,
        requestId: request._id,
        type: 'EMERGENCY_REQUEST',
        title: `New Emergency Blood Request Created`,
        message: `Patient request created for ${unitsRequired} units of ${bloodGroup}. Pending hospital verification.`,
        metadata: { requestId: request._id, bloodGroup, unitsRequired },
      });
    }

    return { request, initialMatches: matches };
  }

  /**
   * Verify an emergency request by a hospital staff or admin.
   */
  async verifyRequest(requestId, verifierUserId, isApproved = true, ipAddress = '127.0.0.1') {
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      const err = new Error('Request not found');
      err.statusCode = 404;
      throw err;
    }

    request.verificationStatus = isApproved ? 'VERIFIED' : 'REJECTED';
    if (isApproved && request.status === 'PENDING_VERIFICATION') {
      request.status = 'ACTIVE';
    } else if (!isApproved) {
      request.status = 'CANCELLED';
    }

    await request.save();

    await AuditLog.create({
      userId: verifierUserId,
      action: isApproved ? 'Request Verified' : 'Request Rejected',
      entityType: 'EmergencyRequest',
      entityId: request._id.toString(),
      metadata: { verificationStatus: request.verificationStatus, status: request.status },
      ipAddress,
    });

    // Notify requester
    await notificationService.notifyUser({
      userId: request.requesterId,
      requestId: request._id,
      type: 'HOSPITAL_CONFIRMED',
      title: isApproved ? 'Emergency Request Verified' : 'Emergency Request Rejected',
      message: isApproved
        ? 'Your emergency request has been verified by the medical facility. Active matching is underway.'
        : 'Your emergency request could not be verified by the medical facility.',
      metadata: { requestId: request._id, status: request.status },
    });

    return request;
  }

  /**
   * Donor accepts an emergency request.
   */
  async acceptRequest(requestId, donorUserId, notes = '') {
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      const err = new Error('Emergency request not found');
      err.statusCode = 404;
      throw err;
    }

    if (['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(request.status)) {
      const err = new Error(`Request is no longer active (current status: ${request.status})`);
      err.statusCode = 400;
      throw err;
    }

    // Update DonorMatch status
    const match = await DonorMatch.findOneAndUpdate(
      { requestId, donorId: donorUserId },
      {
        matchStatus: 'ACCEPTED',
        response: 'ACCEPTED',
        responseNotes: notes,
      },
      { new: true }
    );

    // Update Request status to ACCEPTED
    request.status = 'ACCEPTED';
    request.acceptedDonorId = donorUserId;
    await request.save();

    // Log Audit Trail
    await AuditLog.create({
      userId: donorUserId,
      action: 'Donor Accepted',
      entityType: 'EmergencyRequest',
      entityId: requestId,
      metadata: { donorUserId, notes },
    });

    // Notify Hospital
    const hospital = await Hospital.findById(request.hospitalId);
    if (hospital && hospital.userId) {
      await notificationService.notifyUser({
        userId: hospital.userId,
        requestId,
        type: 'DONOR_ACCEPTED',
        title: 'A Donor has Accepted the Emergency Request',
        message: `A compatible donor has accepted the request for ${request.bloodGroup}. Please coordinate donor arrival.`,
        metadata: { requestId, donorId: donorUserId },
      });
    }

    // Notify Requester/Patient
    await notificationService.notifyUser({
      userId: request.requesterId,
      requestId,
      type: 'DONOR_ACCEPTED',
      title: 'Donor Found for Your Emergency Request!',
      message: `A verified donor has accepted your blood request for ${request.bloodGroup}. The hospital has been notified.`,
      metadata: { requestId, donorId: donorUserId },
    });

    return { request, match };
  }

  /**
   * Donor rejects an emergency request, with option to relay to nearby eligible donors.
   */
  async rejectRequest(requestId, donorUserId, relayToNearby = true) {
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      const err = new Error('Emergency request not found');
      err.statusCode = 404;
      throw err;
    }

    // Update DonorMatch
    await DonorMatch.findOneAndUpdate(
      { requestId, donorId: donorUserId },
      {
        matchStatus: 'REJECTED',
        response: relayToNearby ? 'RELAYED' : 'REJECTED',
      }
    );

    // If relay enabled, find next available donor within expanded radius
    if (relayToNearby) {
      const existingMatches = await DonorMatch.find({ requestId }).select('donorId');
      const excludedIds = existingMatches.map((m) => m.donorId.toString());

      const nextMatches = await matchingService.findMatches({
        recipientBloodGroup: request.bloodGroup,
        componentType: request.componentType,
        latitude: request.latitude,
        longitude: request.longitude,
        radiusKm: Math.min(request.currentRadius + 5, 50),
        urgency: request.urgency,
        excludeDonorIds: excludedIds,
      });

      if (nextMatches.donors.length > 0) {
        const nextDonor = nextMatches.donors[0];
        await DonorMatch.create({
          requestId,
          donorId: nextDonor.donorId,
          matchScore: nextDonor.score,
          distance: nextDonor.distance,
          matchStatus: 'NOTIFIED',
          notificationStatus: 'SENT',
        });

        await notificationService.notifyUser({
          userId: nextDonor.donorId,
          requestId,
          type: 'EMERGENCY_REQUEST',
          title: `🚨 Relayed Emergency Blood Need: ${request.bloodGroup}`,
          message: `Relayed emergency request for ${request.bloodGroup} blood at ${request.location}.`,
          metadata: { requestId, distance: nextDonor.distance },
        });
      }
    }

    return { success: true, message: 'Request response recorded.' };
  }

  /**
   * Confirm donor arrival and completed donation (hospital staff only).
   */
  async confirmDonation({
    requestId,
    donorId,
    hospitalUserId,
    unitsDonated = 1,
    componentType = 'WHOLE_BLOOD',
    notes = '',
  }) {
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      const err = new Error('Emergency request not found');
      err.statusCode = 404;
      throw err;
    }

    const hospital = await Hospital.findOne({ userId: hospitalUserId });
    const hospitalId = hospital ? hospital._id : request.hospitalId;

    // 1. Create Donation Record
    const donation = await Donation.create({
      donorId,
      hospitalId,
      requestId,
      componentType,
      units: unitsDonated,
      status: 'COMPLETED',
      verifiedBy: hospitalUserId,
      notes,
    });

    // 2. Update Request Units and Status
    request.unitsFulfilled = (request.unitsFulfilled || 0) + unitsDonated;
    if (request.unitsFulfilled >= request.unitsRequired) {
      request.status = 'FULFILLED';
    } else {
      request.status = 'IN_PROGRESS';
    }
    await request.save();

    // 3. Update Donor Profile: lastDonationDate, donationCount
    await DonorProfile.findOneAndUpdate(
      { userId: donorId },
      {
        lastDonationDate: new Date(),
        $inc: { donationCount: 1 },
        eligibilityStatus: 'COOLDOWN',
      }
    );

    // 4. Log Audit Trail
    await AuditLog.create({
      userId: hospitalUserId,
      action: 'Donation Confirmed',
      entityType: 'Donation',
      entityId: donation._id.toString(),
      metadata: { requestId, donorId, unitsDonated, requestStatus: request.status },
    });

    // 5. Notify Donor & Patient
    await notificationService.notifyUser({
      userId: donorId,
      requestId,
      type: 'DONATION_COMPLETED',
      title: '🎉 Thank You for Saving a Life!',
      message: `Your donation of ${unitsDonated} unit(s) has been officially verified and recorded. You are a hero!`,
      metadata: { donationId: donation._id },
    });

    await notificationService.notifyUser({
      userId: request.requesterId,
      requestId,
      type: 'DONATION_COMPLETED',
      title: 'Donation Completed for Your Request',
      message: `Donation of ${unitsDonated} unit(s) completed. Current fulfilled: ${request.unitsFulfilled}/${request.unitsRequired}.`,
      metadata: { requestId, unitsFulfilled: request.unitsFulfilled },
    });

    return { request, donation };
  }

  /**
   * Escalate an active emergency request to a wider radius.
   * Progression: 5km -> 10km -> 20km -> 50km -> Blood Banks -> Partner Hospitals.
   */
  async escalateRequest(requestId) {
    const request = await EmergencyRequest.findById(requestId);
    if (!request || ['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(request.status)) {
      return null;
    }

    const tiers = [
      { tier: 1, radius: 5, label: '0–5 km Initial Proximity' },
      { tier: 2, radius: 10, label: '5–10 km Local Radius' },
      { tier: 3, radius: 20, label: '10–20 km Metro Radius' },
      { tier: 4, radius: 50, label: '20–50 km Regional Radius' },
      { tier: 5, radius: 75, label: 'Registered Blood Banks Broadcast' },
      { tier: 6, radius: 100, label: 'Partner Hospitals Emergency Broadcast' },
    ];

    const currentTierIndex = request.escalationTier || 1;
    if (currentTierIndex >= tiers.length) {
      return request; // Maximum escalation reached
    }

    const nextTierConfig = tiers[currentTierIndex]; // next index
    request.escalationTier = nextTierConfig.tier;
    request.currentRadius = nextTierConfig.radius;
    await request.save();

    // Query already contacted donors
    const existingMatches = await DonorMatch.find({ requestId }).select('donorId');
    const excludedIds = existingMatches.map((m) => m.donorId.toString());

    // Find new eligible donors in expanded radius
    const matches = await matchingService.findMatches({
      recipientBloodGroup: request.bloodGroup,
      componentType: request.componentType,
      latitude: request.latitude,
      longitude: request.longitude,
      radiusKm: request.currentRadius,
      urgency: request.urgency,
      excludeDonorIds: excludedIds,
    });

    for (const donor of matches.donors) {
      await DonorMatch.findOneAndUpdate(
        { requestId: request._id, donorId: donor.donorId },
        {
          requestId: request._id,
          donorId: donor.donorId,
          matchScore: donor.score,
          distance: donor.distance,
          matchStatus: 'NOTIFIED',
          notificationStatus: 'SENT',
        },
        { upsert: true, new: true }
      );

      await notificationService.notifyUser({
        userId: donor.donorId,
        requestId: request._id,
        type: 'ESCALATION_ALERT',
        title: `🚨 ESCALATED Emergency Need: ${request.bloodGroup}`,
        message: `Emergency blood request escalated to ${nextTierConfig.label} (${request.location}).`,
        metadata: {
          requestId: request._id,
          bloodGroup: request.bloodGroup,
          distance: donor.distance,
          tier: nextTierConfig.tier,
        },
      });
    }

    // Log escalation audit
    await AuditLog.create({
      action: 'Emergency Escalation',
      entityType: 'EmergencyRequest',
      entityId: request._id.toString(),
      metadata: {
        newTier: nextTierConfig.tier,
        radius: nextTierConfig.radius,
        newDonorsFound: matches.donors.length,
      },
    });

    return request;
  }
}

module.exports = new EmergencyService();
