const { sendError } = require('../utils/responseHelper');
const {
  isValidEmail,
  isValidPhone,
  isValidBloodGroup,
  isValidCoordinates,
} = require('../utils/validators');

const validateRegister = (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return sendError(res, 'Name must be at least 2 characters long.', 'VALIDATION_ERROR', 400);
  }

  if (!isValidEmail(email)) {
    return sendError(res, 'A valid email address is required.', 'VALIDATION_ERROR', 400);
  }

  if (!isValidPhone(phone)) {
    return sendError(res, 'A valid phone number is required (min 8 digits).', 'VALIDATION_ERROR', 400);
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long.', 'VALIDATION_ERROR', 400);
  }

  const validRoles = ['DONOR', 'PATIENT', 'HOSPITAL', 'BLOOD_BANK', 'ADMIN'];
  if (role && !validRoles.includes(role)) {
    return sendError(res, `Invalid role. Allowed: ${validRoles.join(', ')}`, 'VALIDATION_ERROR', 400);
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 'Email and password are required.', 'VALIDATION_ERROR', 400);
  }
  next();
};

const validateEmergencyRequest = (req, res, next) => {
  const { bloodGroup, unitsRequired, hospitalId, urgency, requiredDate, requiredTime } = req.body;

  if (!isValidBloodGroup(bloodGroup)) {
    return sendError(res, 'A valid blood group is required (e.g. O+, O-, A+, etc.).', 'VALIDATION_ERROR', 400);
  }

  const units = parseInt(unitsRequired, 10);
  if (isNaN(units) || units < 1 || units > 20) {
    return sendError(res, 'Units required must be between 1 and 20.', 'VALIDATION_ERROR', 400);
  }

  if (!hospitalId) {
    return sendError(res, 'A valid hospital selection is required.', 'VALIDATION_ERROR', 400);
  }

  const validUrgencies = ['CRITICAL', 'IMMEDIATE', 'HIGH', 'MEDIUM'];
  if (urgency && !validUrgencies.includes(urgency)) {
    return sendError(res, `Invalid urgency. Allowed: ${validUrgencies.join(', ')}`, 'VALIDATION_ERROR', 400);
  }

  if (!requiredDate || !requiredTime) {
    return sendError(res, 'Required date and time are required.', 'VALIDATION_ERROR', 400);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEmergencyRequest,
};
