const Notification = require('../models/Notification');
const firebaseService = require('../config/firebase');

class NotificationService {
  constructor() {
    this.io = null;
  }

  setSocketIO(ioInstance) {
    this.io = ioInstance;
  }

  /**
   * Send notification to a specific user and broadcast via Socket.IO
   */
  async notifyUser({ userId, requestId = null, type, title, message, metadata = {} }) {
    try {
      // 1. Create DB notification record
      const notification = await Notification.create({
        userId,
        requestId,
        type,
        title,
        message,
        metadata,
      });

      // 2. Real-time emit to user's personal room if connected
      if (this.io) {
        this.io.to(`user:${userId.toString()}`).emit('notification:new', notification);
        if (requestId) {
          this.io.to(`request:${requestId.toString()}`).emit('request:update', {
            type,
            title,
            message,
            metadata,
          });
        }
      }

      // 3. Simulated/real Push notification
      if (metadata && metadata.fcmToken) {
        await firebaseService.sendPushNotification(metadata.fcmToken, title, message, metadata);
      }

      return notification;
    } catch (err) {
      console.error('[NotificationService] Error creating notification:', err.message);
      return null;
    }
  }

  /**
   * Broadcast general event to all connected clients
   */
  broadcast(event, payload) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }
}

module.exports = new NotificationService();
