const mongoose = require('mongoose');
const { VALID_BLOOD_GROUPS, VALID_COMPONENT_TYPES } = require('../utils/bloodCompatibility');

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      default: null,
      index: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
      index: true,
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
    availableUnits: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reservedUnits: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Available', 'Recently Updated', 'Not Available', 'Needs Verification'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

bloodInventorySchema.index({ bloodBankId: 1, bloodGroup: 1, componentType: 1 });
bloodInventorySchema.index({ hospitalId: 1, bloodGroup: 1 });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
