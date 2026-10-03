const mongoose = require('mongoose');

const donorMatchSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      required: true,
      index: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    distance: {
      type: Number,
      required: true, // in km
    },
    matchStatus: {
      type: String,
      enum: ['MATCHED', 'NOTIFIED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
      default: 'MATCHED',
      index: true,
    },
    notificationStatus: {
      type: String,
      enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
      default: 'PENDING',
    },
    response: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'TIMEOUT', 'RELAYED'],
      default: 'PENDING',
    },
    responseNotes: {
      type: String,
      default: '',
    },
    relayedToDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

donorMatchSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

module.exports = mongoose.model('DonorMatch', donorMatchSchema);
