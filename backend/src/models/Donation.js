const mongoose = require('mongoose');
const { VALID_COMPONENT_TYPES } = require('../utils/bloodCompatibility');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
      index: true,
    },
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      default: null,
      index: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      default: null,
      index: true,
    },
    donationDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    componentType: {
      type: String,
      enum: VALID_COMPONENT_TYPES,
      default: 'WHOLE_BLOOD',
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donation', donationSchema);
