const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'hemolink_jwt_access_secret_key_change_in_production_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'hemolink_jwt_refresh_secret_key_change_in_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'hemolink-emergency',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
  },
  mapsApiKey: process.env.MAPS_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  escalationIntervalMinutes: parseInt(process.env.ESCALATION_INTERVAL_MINUTES, 10) || 5,
};

module.exports = config;
