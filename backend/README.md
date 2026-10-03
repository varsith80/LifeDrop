# HemoLink Backend API

The RESTful API and real-time coordination engine powering HemoLink.

## Features
- **Medical Blood Compatibility Safeguard**: ABO/Rh rule matrices for Whole Blood, PRBC, Platelets, and FFP with medical safety disclaimer.
- **Smart Matching Service**: Proximity (Haversine formula), blood compatibility, live donor availability, urgency weight, and cooldown calculation.
- **Automatic Emergency Escalation**: Periodic scheduled cron job that broadens the radius in 6 progressive tiers.
- **Real-Time WebSockets**: Socket.IO events for live request tracking, donor acceptance, and blood bank stock reservations.
- **MongoDB Models**: Users, DonorProfiles, Hospitals, BloodBanks, BloodInventory, EmergencyRequests, DonorMatches, Donations, Notifications, AuditLogs.
- **Zero-Friction Local Development**: Embedded in-memory MongoDB fallback when external MongoDB URI is not provided.

## Scripts
- `npm run dev`: Start backend server with nodemon
- `npm run seed`: Populate realistic demo data (25 donors, 6 hospitals, 6 blood banks, 10 requests)
- `npm test`: Run automated test suite
