const { sendError } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, messages.join(', '), 'VALIDATION_ERROR', 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `An entry with this ${field} already exists.`, 'DUPLICATE_ENTRY', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authorization token.', 'INVALID_TOKEN', 401);
  }

  return sendError(res, err.message || 'Internal server error', 'SERVER_ERROR', err.statusCode || 500);
};

const notFoundHandler = (req, res) => {
  return sendError(res, `Cannot ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND', 404);
};

module.exports = { errorHandler, notFoundHandler };
