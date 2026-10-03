const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'EMERGENCY_REQUEST',
        'DONOR_MATCH',
        'DONOR_ACCEPTED',
        'DONOR_REJECTED',
        'HOSPITAL_CONFIRMED',
        'DONATION_COMPLETED',
        'REQUEST_CANCELLED',
        'REQUEST_EXPIRED',
        'ESCALATION_ALERT',
        'ELIGIBILITY_REMINDER',
        'SYSTEM_ANNOUNCEMENT',
      ],
      default: 'EMERGENCY_REQUEST',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
