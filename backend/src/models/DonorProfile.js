const mongoose = require('mongoose');
const { VALID_BLOOD_GROUPS } = require('../utils/bloodCompatibility');

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: VALID_BLOOD_GROUPS,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
      default: 'PREFER_NOT_TO_SAY',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      index: true,
    },
    longitude: {
      type: Number,
      required: true,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'AVAILABLE_LATER', 'UNAVAILABLE'],
      default: 'AVAILABLE',
      index: true,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    eligibilityStatus: {
      type: String,
      enum: ['ELIGIBLE', 'COOLDOWN', 'INELIGIBLE'],
      default: 'ELIGIBLE',
    },
    preferredRadius: {
      type: Number,
      default: 15, // km
    },
    notificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geo compound index for location searches
donorProfileSchema.index({ latitude: 1, longitude: 1 });
donorProfileSchema.index({ bloodGroup: 1, availabilityStatus: 1 });

module.exports = mongoose.model('DonorProfile', donorProfileSchema);
