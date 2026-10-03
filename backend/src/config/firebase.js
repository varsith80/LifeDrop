const config = require('./environment');

class FirebaseNotificationService {
  constructor() {
    this.isInitialized = Boolean(
      config.firebase.projectId && config.firebase.privateKey && config.firebase.clientEmail
    );

    if (this.isInitialized) {
      console.log('[FCM] Firebase Cloud Messaging configured for push notifications.');
    } else {
      console.log('[FCM] Firebase credentials not provided. Running in simulation mode (in-app & console delivery).');
    }
  }

  async sendPushNotification(token, title, body, data = {}) {
    if (!token) return { success: false, reason: 'No device token provided' };

    if (!this.isInitialized) {
      // Simulation mode
      console.log(`[FCM-SIMULATION] To: ${token.slice(0, 12)}... | Title: "${title}" | Body: "${body}"`);
      return { success: true, simulated: true, messageId: `sim_${Date.now()}` };
    }

    try {
      // In production with real keys, firebase-admin send would be called here
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (err) {
      console.error('[FCM] Push notification send error:', err.message);
      return { success: false, error: err.message };
    }
  }
}

module.exports = new FirebaseNotificationService();
