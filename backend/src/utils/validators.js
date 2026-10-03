const { VALID_BLOOD_GROUPS, VALID_COMPONENT_TYPES } = require('./bloodCompatibility');

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Allow digits, +, -, spaces, min 8 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{8,15}$/.test(cleaned);
};

const isValidBloodGroup = (group) => {
  return VALID_BLOOD_GROUPS.includes(group);
};

const isValidComponentType = (type) => {
  return VALID_COMPONENT_TYPES.includes(type);
};

const isValidCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  if (isNaN(latitude) || isNaN(longitude)) return false;
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

const isValidRole = (role) => {
  const roles = ['DONOR', 'PATIENT', 'HOSPITAL', 'BLOOD_BANK', 'ADMIN'];
  return roles.includes(role);
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidBloodGroup,
  isValidComponentType,
  isValidCoordinates,
  isValidRole,
};
