const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { MEDICAL_SAFETY_DISCLAIMER } = require('./utils/bloodCompatibility');

// Route imports
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security and middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: '*', // Allow all origins for dev/demo mobility
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health and info check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'HemoLink Blood Donation & Emergency Availability Platform',
    timestamp: new Date().toISOString(),
    medicalDisclaimer: MEDICAL_SAFETY_DISCLAIMER,
  });
});

// Apply rate limiting
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/patient', patientRoutes); // alias
app.use('/api/emergency', emergencyRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
