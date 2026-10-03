const mongoose = require('mongoose');
const { VALID_BLOOD_GROUPS, VALID_COMPONENT_TYPES } = require('../utils/bloodCompatibility');

const emergencyRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      default: 'Emergency Patient',
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: VALID_BLOOD_GROUPS,
      index: true,
    },
    componentType: {
      type: String,
      required: true,
      enum: VALID_COMPONENT_TYPES,
      default: 'WHOLE_BLOOD',
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unitsFulfilled: {
      type: Number,
      default: 0,
      min: 0,
    },
    urgency: {
      type: String,
      enum: ['CRITICAL', 'IMMEDIATE', 'HIGH', 'MEDIUM'],
      default: 'HIGH',
      index: true,
    },
    requiredDate: {
      type: String,
      required: true,
    },
    requiredTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    additionalInformation: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'PENDING_VERIFICATION',
        'VERIFIED',
        'ACTIVE',
        'MATCHING',
        'ACCEPTED',
        'IN_PROGRESS',
        'FULFILLED',
        'CANCELLED',
        'EXPIRED',
      ],
      default: 'PENDING_VERIFICATION',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    currentRadius: {
      type: Number,
      default: 5, // Starts at 5km
    },
    escalationTier: {
      type: Number,
      default: 1, // 1: 5km, 2: 10km, 3: 20km, 4: 50km, 5: Blood Banks, 6: Partner Hospitals
    },
    acceptedDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

emergencyRequestSchema.index({ latitude: 1, longitude: 1 });
emergencyRequestSchema.index({ status: 1, expiresAt: 1 });
emergencyRequestSchema.index({ requesterId: 1, hospitalId: 1, bloodGroup: 1, status: 1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
