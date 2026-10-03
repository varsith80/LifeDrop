const cron = require('node-cron');
const EmergencyRequest = require('../models/EmergencyRequest');
const notificationService = require('../services/notificationService');
const AuditLog = require('../models/AuditLog');

const runExpiryCycle = async () => {
  try {
    const expiredRequests = await EmergencyRequest.find({
      status: { $in: ['MATCHING', 'ACTIVE', 'PENDING_VERIFICATION'] },
      expiresAt: { $lte: new Date() },
    });

    for (const req of expiredRequests) {
      req.status = 'EXPIRED';
      await req.save();

      await AuditLog.create({
        action: 'Request Expired',
        entityType: 'EmergencyRequest',
        entityId: req._id.toString(),
        metadata: { expiredAt: new Date() },
      });

      await notificationService.notifyUser({
        userId: req.requesterId,
        requestId: req._id,
        type: 'REQUEST_EXPIRED',
        title: 'Emergency Request Expired',
        message: `Your emergency request for ${req.bloodGroup} blood has reached its validity time limit. You can re-initiate if blood is still required.`,
      });

      console.log(`[ExpiryJob] Request ${req._id} marked as EXPIRED.`);
    }
  } catch (err) {
    console.error('[ExpiryJob] Error in expiry cycle:', err.message);
  }
};

const initExpiryJob = () => {
  // Check every 5 minutes
  const task = cron.schedule('*/5 * * * *', () => {
    runExpiryCycle();
  });
  console.log('[ExpiryJob] Scheduled request expiry job initialized.');
  return task;
};

module.exports = { initExpiryJob, runExpiryCycle };
