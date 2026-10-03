const DonorProfile = require('../models/DonorProfile');
const BloodInventory = require('../models/BloodInventory');
const BloodBank = require('../models/BloodBank');
const User = require('../models/User');
const { isBloodCompatible, getCompatibleDonorGroups, MEDICAL_SAFETY_DISCLAIMER } = require('../utils/bloodCompatibility');
const { calculateDistance } = require('../utils/distanceCalculator');

class MatchingService {
  /**
   * Calculate Smart Matching Score (0 - 100).
   * 
   * Factors:
   * 1. Compatibility Factor (30 pts max) - Medically verified ABO/Rh compatibility
   * 2. Distance Factor (25 pts max) - Closer donors get higher score
   * 3. Availability Factor (20 pts max) - AVAILABLE gets full, AVAILABLE_LATER gets partial
   * 4. Urgency Factor (15 pts max) - Scaled based on request urgency
   * 5. Eligibility Factor (10 pts max) - Based on cooldown period (>= 90 days)
   */
  calculateScore({ isExactMatch, distance, radius, availability, urgency, daysSinceLastDonation }) {
    let score = 0;

    // 1. Compatibility Factor (max 30)
    // Medical safety: Non-compatible blood is excluded BEFORE scoring.
    if (isExactMatch) {
      score += 30; // Exact blood group match preferred
    } else {
      score += 25; // Medically compatible donor (e.g. O- for A+)
    }

    // 2. Distance Factor (max 25)
    // Scale distance inversely within radius
    const maxRadius = Math.max(radius || 15, 5);
    const distanceRatio = Math.max(0, Math.min(1, 1 - distance / maxRadius));
    score += Math.round(distanceRatio * 25);

    // 3. Availability Factor (max 20)
    if (availability === 'AVAILABLE') {
      score += 20;
    } else if (availability === 'AVAILABLE_LATER') {
      score += 10;
    } else {
      score += 0;
    }

    // 4. Urgency Factor (max 15)
    switch (urgency) {
      case 'CRITICAL':
        score += 15;
        break;
      case 'IMMEDIATE':
        score += 12;
        break;
      case 'HIGH':
        score += 9;
        break;
      case 'MEDIUM':
      default:
        score += 6;
        break;
    }

    // 5. Eligibility Factor (max 10)
    if (daysSinceLastDonation === null || daysSinceLastDonation >= 90) {
      score += 10;
    } else if (daysSinceLastDonation >= 60) {
      score += 5;
    } else {
      score += 0;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Find and rank all eligible donors and blood banks for an emergency request.
   */
  async findMatches({
    recipientBloodGroup,
    componentType = 'WHOLE_BLOOD',
    latitude,
    longitude,
    radiusKm = 15,
    urgency = 'HIGH',
    excludeDonorIds = [],
  }) {
    // 1. Strict Medical Compatibility Check
    const compatibleGroups = getCompatibleDonorGroups(recipientBloodGroup, componentType);

    // 2. Query Donors with compatible groups who are not UNAVAILABLE
    const donorProfiles = await DonorProfile.find({
      bloodGroup: { $in: compatibleGroups },
      availabilityStatus: { $in: ['AVAILABLE', 'AVAILABLE_LATER'] },
    }).populate('userId', 'name phone email profileImage isActive isVerified');

    const now = new Date();
    const rankedDonors = [];

    for (const donor of donorProfiles) {
      if (!donor.userId || !donor.userId.isActive) continue;
      if (excludeDonorIds.includes(donor.userId._id.toString())) continue;

      // Distance calculation
      const dist = calculateDistance(latitude, longitude, donor.latitude, donor.longitude);
      if (dist > radiusKm) continue;

      // Eligibility calculation
      let daysSinceLastDonation = null;
      if (donor.lastDonationDate) {
        const diffMs = now - new Date(donor.lastDonationDate);
        daysSinceLastDonation = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      const isExactMatch = donor.bloodGroup === recipientBloodGroup;
      const score = this.calculateScore({
        isExactMatch,
        distance: dist,
        radius: radiusKm,
        availability: donor.availabilityStatus,
        urgency,
        daysSinceLastDonation,
      });

      rankedDonors.push({
        donorId: donor.userId._id,
        profileId: donor._id,
        name: donor.userId.name,
        bloodGroup: donor.bloodGroup,
        isExactMatch,
        distance: dist,
        availability: donor.availabilityStatus,
        matchStatus: 'ELIGIBLE_FOR_CONTACT',
        score,
        lastDonationDate: donor.lastDonationDate,
        daysSinceLastDonation,
        eligibilityStatus:
          daysSinceLastDonation === null || daysSinceLastDonation >= 90 ? 'ELIGIBLE' : 'COOLDOWN',
      });
    }

    // Sort by match score descending, then distance ascending
    rankedDonors.sort((a, b) => b.score - a.score || a.distance - b.distance);

    // 3. Query Nearby Blood Banks with available compatible inventory
    const bloodInventories = await BloodInventory.find({
      bloodGroup: { $in: compatibleGroups },
      componentType,
      availableUnits: { $gt: 0 },
    }).populate({
      path: 'bloodBankId',
      select: 'name registrationNumber address city phone latitude longitude verificationStatus',
    });

    const availableBloodBanks = [];
    for (const inv of bloodInventories) {
      if (!inv.bloodBankId) continue;
      const bank = inv.bloodBankId;
      const dist = calculateDistance(latitude, longitude, bank.latitude, bank.longitude);

      if (dist <= radiusKm * 2) {
        // Allow slightly wider radius for blood banks
        availableBloodBanks.push({
          bloodBankId: bank._id,
          name: bank.name,
          address: bank.address,
          city: bank.city,
          phone: bank.phone,
          distance: dist,
          bloodGroup: inv.bloodGroup,
          availableUnits: inv.availableUnits,
          reservedUnits: inv.reservedUnits,
          verificationStatus: inv.verificationStatus,
          lastUpdated: inv.lastUpdated,
          expiryDate: inv.expiryDate,
        });
      }
    }

    availableBloodBanks.sort((a, b) => a.distance - b.distance);

    return {
      medicalDisclaimer: MEDICAL_SAFETY_DISCLAIMER,
      recipientBloodGroup,
      compatibleGroups,
      radiusKm,
      totalDonorsFound: rankedDonors.length,
      totalBloodBanksFound: availableBloodBanks.length,
      donors: rankedDonors,
      bloodBanks: availableBloodBanks,
    };
  }
}

module.exports = new MatchingService();
