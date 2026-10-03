const cron = require('node-cron');
const EmergencyRequest = require('../models/EmergencyRequest');
const emergencyService = require('../services/emergencyService');
const config = require('../config/environment');

const runEscalationCycle = async () => {
  try {
    const cutoffTime = new Date(Date.now() - config.escalationIntervalMinutes * 60 * 1000);

    // Find requests that are active/matching, not fulfilled, created or updated prior to interval, and tier < 6
    const requestsToEscalate = await EmergencyRequest.find({
      status: { $in: ['MATCHING', 'ACTIVE'] },
      escalationTier: { $lt: 6 },
      updatedAt: { $lte: cutoffTime },
      expiresAt: { $gt: new Date() },
    });

    for (const req of requestsToEscalate) {
      console.log(`[EscalationJob] Escalating request ${req._id} (Current tier: ${req.escalationTier}, radius: ${req.currentRadius}km)`);
      await emergencyService.escalateRequest(req._id);
    }
  } catch (err) {
    console.error('[EscalationJob] Error in escalation cycle:', err.message);
  }
};

const initEscalationJob = () => {
  // Run every 2 minutes in development / background
  const task = cron.schedule('*/2 * * * *', () => {
    runEscalationCycle();
  });
  console.log('[EscalationJob] Scheduled emergency escalation job initialized.');
  return task;
};

module.exports = { initEscalationJob, runEscalationCycle };
