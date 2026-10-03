const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const emergencyService = require('../src/services/emergencyService');
const bloodBankService = require('../src/services/bloodBankService');
const EmergencyRequest = require('../src/models/EmergencyRequest');
const BloodBank = require('../src/models/BloodBank');
const BloodInventory = require('../src/models/BloodInventory');
const User = require('../src/models/User');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Escalation Engine & Blood Bank Inventory', () => {
  let bbToken;
  let bloodBankId;
  let testRequestId;

  beforeAll(async () => {
    // Register Blood Bank
    const res = await request(app).post('/api/auth/register').send({
      name: 'Central Life Blood Bank',
      email: 'clbb@bloodbank.org',
      phone: '+91 97777 88888',
      password: 'Password@123',
      role: 'BLOOD_BANK',
      address: 'Central Square',
      city: 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
    });
    bbToken = res.body.data.accessToken;

    const bbDoc = await BloodBank.findOne({ email: 'clbb@bloodbank.org' });
    bloodBankId = bbDoc._id.toString();

    // Create a mock active emergency request
    const mockUser = await User.findOne({ email: 'clbb@bloodbank.org' });
    const reqDoc = await EmergencyRequest.create({
      requesterId: mockUser._id,
      hospitalId: bbDoc._id, // use as placeholder ref
      patientName: 'Test Patient for Escalation',
      bloodGroup: 'B+',
      unitsRequired: 2,
      urgency: 'CRITICAL',
      requiredDate: '2026-10-04',
      requiredTime: 'ASAP',
      location: 'Emergency Wing',
      latitude: 13.0827,
      longitude: 80.2707,
      status: 'ACTIVE',
      currentRadius: 5,
      escalationTier: 1,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
    });
    testRequestId = reqDoc._id.toString();
  });

  test('Escalation expands radius from 5 km (Tier 1) to 10 km (Tier 2)', async () => {
    const escalated = await emergencyService.escalateRequest(testRequestId);

    expect(escalated.escalationTier).toBe(2);
    expect(escalated.currentRadius).toBe(10);
  });

  test('Subsequent escalation expands radius from 10 km to 20 km (Tier 3)', async () => {
    const escalated = await emergencyService.escalateRequest(testRequestId);

    expect(escalated.escalationTier).toBe(3);
    expect(escalated.currentRadius).toBe(20);
  });

  test('Blood Bank adds stock to inventory and updates verificationStatus', async () => {
    const addRes = await request(app)
      .post(`/api/blood-banks/${bloodBankId}/inventory`)
      .set('Authorization', `Bearer ${bbToken}`)
      .send({
        bloodGroup: 'O+',
        componentType: 'WHOLE_BLOOD',
        availableUnits: 10,
        reservedUnits: 1,
      });

    expect(addRes.statusCode).toBe(201);
    expect(addRes.body.data.availableUnits).toBe(10);
    const inventoryId = addRes.body.data._id;

    // Fetch inventory
    const getRes = await request(app).get(`/api/blood-banks/${bloodBankId}/inventory`);
    expect(getRes.statusCode).toBe(200);
    const item = getRes.body.data.find((i) => i._id === inventoryId);
    expect(item).toBeDefined();
    expect(item.verificationStatus).toBe('Recently Updated');
  });
});
