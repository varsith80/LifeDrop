const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const AuditLog = require('../models/AuditLog');

class BloodBankService {
  async getBloodBankByUserId(userId) {
    return BloodBank.findOne({ userId });
  }

  async getAllBloodBanks(filter = {}) {
    return BloodBank.find(filter).sort({ name: 1 });
  }

  async getInventory(bloodBankId) {
    const items = await BloodInventory.find({ bloodBankId }).sort({ bloodGroup: 1, componentType: 1 });

    const now = new Date();
    // Update verification status based on freshness and unit availability
    return items.map((item) => {
      const hoursSinceUpdate = (now - new Date(item.lastUpdated)) / (1000 * 60 * 60);
      let status = item.verificationStatus;

      if (new Date(item.expiryDate) < now || item.availableUnits <= 0) {
        status = 'Not Available';
      } else if (hoursSinceUpdate > 48) {
        status = 'Needs Verification';
      } else if (hoursSinceUpdate < 6) {
        status = 'Recently Updated';
      } else {
        status = 'Available';
      }

      return {
        ...item.toObject(),
        verificationStatus: status,
      };
    });
  }

  async updateInventoryItem(bloodBankId, inventoryId, data, userId = null) {
    const item = await BloodInventory.findOne({ _id: inventoryId, bloodBankId });
    if (!item) {
      throw new Error('Inventory item not found');
    }

    if (data.availableUnits !== undefined) item.availableUnits = Number(data.availableUnits);
    if (data.reservedUnits !== undefined) item.reservedUnits = Number(data.reservedUnits);
    if (data.expiryDate) item.expiryDate = new Date(data.expiryDate);
    if (data.verificationStatus) item.verificationStatus = data.verificationStatus;
    item.lastUpdated = new Date();

    await item.save();

    if (userId) {
      await AuditLog.create({
        userId,
        action: 'Blood Inventory Updated',
        entityType: 'BloodInventory',
        entityId: item._id.toString(),
        metadata: {
          bloodGroup: item.bloodGroup,
          availableUnits: item.availableUnits,
          reservedUnits: item.reservedUnits,
        },
      });
    }

    return item;
  }

  async createInventoryItem(bloodBankId, data, userId = null) {
    const expiry = data.expiryDate
      ? new Date(data.expiryDate)
      : new Date(Date.now() + 35 * 24 * 60 * 60 * 1000); // 35 days standard for whole blood

    const item = await BloodInventory.create({
      bloodBankId,
      bloodGroup: data.bloodGroup,
      componentType: data.componentType || 'WHOLE_BLOOD',
      availableUnits: Number(data.availableUnits || 0),
      reservedUnits: Number(data.reservedUnits || 0),
      expiryDate: expiry,
      lastUpdated: new Date(),
      verificationStatus: 'Recently Updated',
    });

    if (userId) {
      await AuditLog.create({
        userId,
        action: 'Blood Inventory Created',
        entityType: 'BloodInventory',
        entityId: item._id.toString(),
        metadata: { bloodGroup: item.bloodGroup, units: item.availableUnits },
      });
    }

    return item;
  }

  async removeInventoryItem(bloodBankId, inventoryId) {
    return BloodInventory.findOneAndDelete({ _id: inventoryId, bloodBankId });
  }
}

module.exports = new BloodBankService();
