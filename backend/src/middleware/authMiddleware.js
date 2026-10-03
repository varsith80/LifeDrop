const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const User = require('../models/User');
const { sendError } = require('../utils/responseHelper');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 'UNAUTHORIZED', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token format invalid.', 'UNAUTHORIZED', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Authentication token expired.', 'TOKEN_EXPIRED', 401);
      }
      return sendError(res, 'Invalid authentication token.', 'INVALID_TOKEN', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendError(res, 'User no longer exists.', 'USER_NOT_FOUND', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account has been suspended or deactivated.', 'ACCOUNT_DEACTIVATED', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication error.', error.message, 500);
  }
};

module.exports = { authenticate };
