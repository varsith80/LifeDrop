const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');
const AuditLog = require('../models/AuditLog');
const config = require('../config/environment');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  const refreshToken = jwt.sign({ userId, role }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'DONOR',
      bloodGroup,
      dateOfBirth,
      gender,
      location,
      latitude,
      longitude,
      hospitalName,
      registrationNumber,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 'EMAIL_EXISTS', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Patients and Donors can be verified by default; Hospitals & Blood Banks require admin approval
    const isAutoVerified = ['DONOR', 'PATIENT'].includes(role);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role,
      isVerified: isAutoVerified,
      isActive: true,
      lastLoginAt: new Date(),
    });

    // Create role-specific secondary profile
    if (role === 'DONOR') {
      await DonorProfile.create({
        userId: user._id,
        bloodGroup: bloodGroup || 'O+',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('2000-01-01'),
        gender: gender || 'PREFER_NOT_TO_SAY',
        location: location || 'City Center',
        latitude: latitude ? parseFloat(latitude) : 13.0827,
        longitude: longitude ? parseFloat(longitude) : 80.2707,
        availabilityStatus: 'AVAILABLE',
      });
    } else if (role === 'HOSPITAL') {
      await Hospital.create({
        userId: user._id,
        hospitalName: hospitalName || name,
        registrationNumber: registrationNumber || `HOSP-${Date.now()}`,
        address: address || location || 'Hospital Avenue',
        city: city || 'Metro City',
        state: state || 'State',
        pincode: pincode || '600001',
        latitude: latitude ? parseFloat(latitude) : 13.0827,
        longitude: longitude ? parseFloat(longitude) : 80.2707,
        phone,
        email: email.toLowerCase(),
        verificationStatus: 'PENDING',
      });
    } else if (role === 'BLOOD_BANK') {
      await BloodBank.create({
        userId: user._id,
        name: name,
        registrationNumber: registrationNumber || `BB-${Date.now()}`,
        address: address || location || 'Blood Bank Street',
        city: city || 'Metro City',
        state: state || 'State',
        pincode: pincode || '600001',
        latitude: latitude ? parseFloat(latitude) : 13.0827,
        longitude: longitude ? parseFloat(longitude) : 80.2707,
        phone,
        email: email.toLowerCase(),
        verificationStatus: 'PENDING',
      });
    }

    await AuditLog.create({
      userId: user._id,
      action: 'User Registered',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { role, email: user.email },
      ipAddress: req.ip || '127.0.0.1',
    });

    const tokens = generateTokens(user._id, user.role);

    return sendSuccess(
      res,
      'Registration successful.',
      {
        user: user.toJSON(),
        ...tokens,
      },
      201
    );
  } catch (error) {
    return sendError(res, 'Registration failed.', error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account is deactivated or suspended.', 'ACCOUNT_DEACTIVATED', 403);
    }

    user.lastLoginAt = new Date();
    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: 'Login',
      entityType: 'User',
      entityId: user._id.toString(),
      metadata: { email: user.email, role: user.role },
      ipAddress: req.ip || '127.0.0.1',
    });

    const tokens = generateTokens(user._id, user.role);

    // Fetch related profile if donor, hospital, or blood bank
    let profileData = null;
    if (user.role === 'DONOR') {
      profileData = await DonorProfile.findOne({ userId: user._id });
    } else if (user.role === 'HOSPITAL') {
      profileData = await Hospital.findOne({ userId: user._id });
    } else if (user.role === 'BLOOD_BANK') {
      profileData = await BloodBank.findOne({ userId: user._id });
    }

    return sendSuccess(res, 'Login successful.', {
      user: user.toJSON(),
      profile: profileData,
      ...tokens,
    });
  } catch (error) {
    return sendError(res, 'Login failed.', error.message, 500);
  }
};

const logout = async (req, res) => {
  return sendSuccess(res, 'Logged out successfully.');
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return sendError(res, 'Refresh token required.', 'UNAUTHORIZED', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtRefreshSecret);
    } catch (err) {
      return sendError(res, 'Invalid or expired refresh token.', 'UNAUTHORIZED', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return sendError(res, 'User not active or found.', 'UNAUTHORIZED', 401);
    }

    const tokens = generateTokens(user._id, user.role);
    return sendSuccess(res, 'Token refreshed successfully.', tokens);
  } catch (error) {
    return sendError(res, 'Token refresh failed.', error.message, 500);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Simulated OTP sending for password reset
  return sendSuccess(res, `A 6-digit verification code has been dispatched to ${email || 'your email'}.`, {
    simulatedOtp: '741258',
  });
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp || otp.length !== 6) {
    return sendError(res, 'Please provide a valid 6-digit OTP code.', 'INVALID_OTP', 400);
  }
  return sendSuccess(res, 'OTP verified successfully.', { verified: true });
};

const getMe = async (req, res) => {
  try {
    let profileData = null;
    if (req.user.role === 'DONOR') {
      profileData = await DonorProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === 'HOSPITAL') {
      profileData = await Hospital.findOne({ userId: req.user._id });
    } else if (req.user.role === 'BLOOD_BANK') {
      profileData = await BloodBank.findOne({ userId: req.user._id });
    }

    return sendSuccess(res, 'Current user profile fetched.', {
      user: req.user.toJSON(),
      profile: profileData,
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch current user profile.', error.message, 500);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyOtp,
  getMe,
};
