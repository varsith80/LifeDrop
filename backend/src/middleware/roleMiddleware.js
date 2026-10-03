const { sendError } = require('../utils/responseHelper');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 'UNAUTHORIZED', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized for this resource. Required: [${roles.join(', ')}]`,
        'FORBIDDEN',
        403
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };
