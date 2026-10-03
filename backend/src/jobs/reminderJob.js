const cron = require('node-cron');
const DonorProfile = require('../models/DonorProfile');
const notificationService = require('../services/notificationService');

const runReminderCycle = async () => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Find donors in COOLDOWN whose last donation was >= 90 days ago
    const eligibleDonors = await DonorProfile.find({
      eligibilityStatus: 'COOLDOWN',
      lastDonationDate: { $lte: ninetyDaysAgo },
    }).populate('userId', 'name');

    for (const profile of eligibleDonors) {
      profile.eligibilityStatus = 'ELIGIBLE';
      await profile.save();

      await notificationService.notifyUser({
        userId: profile.userId._id,
        type: 'ELIGIBILITY_REMINDER',
        title: 'You are Eligible to Donate Blood Again!',
        message: 'Your 90-day donation cooldown has concluded. You can now step forward and save another life.',
      });
      console.log(`[ReminderJob] Eligibility reminder dispatched to donor: ${profile.userId._id}`);
    }
  } catch (err) {
    console.error('[ReminderJob] Error in reminder cycle:', err.message);
  }
};

const initReminderJob = () => {
  // Check once daily at midnight
  const task = cron.schedule('0 0 * * *', () => {
    runReminderCycle();
  });
  console.log('[ReminderJob] Scheduled donor eligibility reminder job initialized.');
  return task;
};

module.exports = { initReminderJob, runReminderCycle };
