const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

class VerificationService {
  async verifyHospital(hospitalId, adminUserId, status = 'VERIFIED') {
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { verificationStatus: status },
      { new: true }
    );

    if (hospital && hospital.userId) {
      await User.findByIdAndUpdate(hospital.userId, { isVerified: status === 'VERIFIED' });
    }

    await AuditLog.create({
      userId: adminUserId,
      action: 'Admin Verification',
      entityType: 'Hospital',
      entityId: hospitalId,
      metadata: { newStatus: status },
    });

    return hospital;
  }

  async verifyBloodBank(bloodBankId, adminUserId, status = 'VERIFIED') {
    const bloodBank = await BloodBank.findByIdAndUpdate(
      bloodBankId,
      { verificationStatus: status },
      { new: true }
    );

    if (bloodBank && bloodBank.userId) {
      await User.findByIdAndUpdate(bloodBank.userId, { isVerified: status === 'VERIFIED' });
    }

    await AuditLog.create({
      userId: adminUserId,
      action: 'Admin Verification',
      entityType: 'BloodBank',
      entityId: bloodBankId,
      metadata: { newStatus: status },
    });

    return bloodBank;
  }

  async toggleUserStatus(userId, adminUserId, isActive) {
    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });

    await AuditLog.create({
      userId: adminUserId,
      action: isActive ? 'Account Activated' : 'Account Suspended',
      entityType: 'User',
      entityId: userId,
      metadata: { isActive },
    });

    return user;
  }
}

module.exports = new VerificationService();
