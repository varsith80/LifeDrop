const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Authentication & Role-Based Access Control', () => {
  const donorUser = {
    name: 'Test Donor',
    email: 'testdonor@hemolink.org',
    phone: '+91 99999 88888',
    password: 'Password@123',
    role: 'DONOR',
    bloodGroup: 'O+',
    location: 'Central Chennai',
  };

  test('POST /api/auth/register creates a new user and returns tokens', async () => {
    const res = await request(app).post('/api/auth/register').send(donorUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(donorUser.email);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  test('POST /api/auth/register prevents duplicate email registrations', async () => {
    const res = await request(app).post('/api/auth/register').send(donorUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('EMAIL_EXISTS');
  });

  test('POST /api/auth/login successfully logs in with correct password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: donorUser.email,
      password: donorUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/login rejects invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: donorUser.email,
      password: 'WrongPassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('INVALID_CREDENTIALS');
  });

  test('GET /api/auth/me rejects request without JWT token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/admin/dashboard forbids access to regular DONOR role', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: donorUser.email,
      password: donorUser.password,
    });
    const token = loginRes.body.data.accessToken;

    const adminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(adminRes.statusCode).toBe(403);
    expect(adminRes.body.error).toBe('FORBIDDEN');
  });
});
