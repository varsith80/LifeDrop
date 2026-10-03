const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('requestId', 'bloodGroup unitsRequired location urgency status')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    return sendSuccess(res, 'Notifications retrieved.', { notifications, unreadCount });
  } catch (err) {
    return sendError(res, 'Failed to fetch notifications.', err.message, 500);
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return sendError(res, 'Notification not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, 'Notification marked as read.', notification);
  } catch (err) {
    return sendError(res, 'Failed to update notification.', err.message, 400);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return sendSuccess(res, 'All notifications marked as read.');
  } catch (err) {
    return sendError(res, 'Failed to mark all as read.', err.message, 500);
  }
};

const registerPushToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return sendError(res, 'Token is required.', 'VALIDATION_ERROR', 400);
    }
    await User.findByIdAndUpdate(req.user._id, { fcmToken: token });
    return sendSuccess(res, 'Push notification token registered.');
  } catch (err) {
    return sendError(res, 'Failed to register token.', err.message, 400);
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  registerPushToken,
};
