const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'An error occurred', error = 'INTERNAL_ERROR', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === 'string' ? error : error.message || 'INTERNAL_ERROR',
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
