const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const Hospital = require('../src/models/Hospital');
const EmergencyRequest = require('../src/models/EmergencyRequest');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Emergency Request Lifecycle & Workflow', () => {
  let patientToken;
  let donorToken;
  let donorUserId;
  let hospitalToken;
  let hospitalId;
  let createdRequestId;

  beforeAll(async () => {
    // 1. Register Hospital
    const hospRes = await request(app).post('/api/auth/register').send({
      name: 'City Trauma Center',
      email: 'trauma@cityhospital.org',
      phone: '+91 91111 22222',
      password: 'Password@123',
      role: 'HOSPITAL',
      hospitalName: 'City Trauma Center',
      address: '100 Medical Way',
      city: 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
    });
    hospitalToken = hospRes.body.data.accessToken;

    const hospDoc = await Hospital.findOne({ email: 'trauma@cityhospital.org' });
    hospitalId = hospDoc._id.toString();

    // 2. Register Patient
    const patientRes = await request(app).post('/api/auth/register').send({
      name: 'Ramesh Patient',
      email: 'ramesh@patient.org',
      phone: '+91 93333 44444',
      password: 'Password@123',
      role: 'PATIENT',
    });
    patientToken = patientRes.body.data.accessToken;

    // 3. Register Donor (O+)
    const donorRes = await request(app).post('/api/auth/register').send({
      name: 'Suresh Donor',
      email: 'suresh@donor.org',
      phone: '+91 95555 66666',
      password: 'Password@123',
      role: 'DONOR',
      bloodGroup: 'O+',
      latitude: 13.085,
      longitude: 80.272,
    });
    donorToken = donorRes.body.data.accessToken;
    donorUserId = donorRes.body.data.user._id;
  });

  test('Patient successfully creates an O+ emergency blood request', async () => {
    const res = await request(app)
      .post('/api/patients/requests')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        bloodGroup: 'O+',
        unitsRequired: 1,
        hospitalId,
        urgency: 'CRITICAL',
        requiredDate: '2026-10-04',
        requiredTime: 'Immediate',
        location: 'City Trauma Center, ICU Ward',
        latitude: 13.0827,
        longitude: 80.2707,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.request._id).toBeDefined();
    expect(res.body.data.request.status).toBe('MATCHING');
    createdRequestId = res.body.data.request._id;
  });

  test('Duplicate detection: prevents duplicate request for same hospital and blood group within active window', async () => {
    const res = await request(app)
      .post('/api/patients/requests')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        bloodGroup: 'O+',
        unitsRequired: 1,
        hospitalId,
        urgency: 'CRITICAL',
        requiredDate: '2026-10-04',
        requiredTime: 'Immediate',
        location: 'City Trauma Center, ICU Ward',
        latitude: 13.0827,
        longitude: 80.2707,
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('DUPLICATE_REQUEST');
  });

  test('Donor views relevant emergency requests and accepts it', async () => {
    const requestsRes = await request(app)
      .get('/api/donors/emergency-requests')
      .set('Authorization', `Bearer ${donorToken}`);

    expect(requestsRes.statusCode).toBe(200);
    expect(requestsRes.body.data.length).toBeGreaterThan(0);

    const acceptRes = await request(app)
      .post(`/api/donors/requests/${createdRequestId}/accept`)
      .set('Authorization', `Bearer ${donorToken}`)
      .send({ notes: 'Arriving in 20 minutes' });

    expect(acceptRes.statusCode).toBe(200);
    expect(acceptRes.body.data.request.status).toBe('ACCEPTED');
  });

  test('Hospital confirms donor arrival and completed donation, fulfilling request', async () => {
    const res = await request(app)
      .post(`/api/hospitals/requests/${createdRequestId}/confirm-donation`)
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({
        donorId: donorUserId,
        unitsDonated: 1,
        componentType: 'WHOLE_BLOOD',
        notes: 'Transfusion successful',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.request.status).toBe('FULFILLED');
    expect(res.body.data.request.unitsFulfilled).toBe(1);
  });
});
