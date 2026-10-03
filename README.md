# HemoLink — Blood Donation & Emergency Blood Availability Platform

> **Tagline: “The right blood. The right donor. At the right time.”**

HemoLink is a real-time blood donation and emergency blood availability platform connecting **Donors**, **Patients / Attendants**, **Hospitals**, **Blood Banks**, and **Admins**. Rather than being a basic blood group directory, HemoLink provides real-time emergency matching, medically verified blood compatibility, nearby donor discovery, automated radius escalation, hospital coordination, and end-to-end transfusion status tracking.

---

## 1. Important Medical Safety Rule

> [!IMPORTANT]
> **Clinical Transfusion Safeguard**:
> AI and automated algorithms are **NEVER permitted to independently make clinical transfusion decisions**.
> Blood compatibility is governed by an immutable, predefined medical matrix (ABO/Rh rules) and all requests require authorized medical/hospital verification before donation and transfusion.
>
> **Mandatory Notice displayed across all client interfaces:**
> *“Blood compatibility and transfusion decisions must be confirmed by an authorized medical professional or blood bank.”*

---

## 2. Key Innovations

1. **Smart Emergency Matching**: Multi-factor scoring incorporating medical compatibility, Haversine proximity distance, live donor availability (`AVAILABLE`, `AVAILABLE_LATER`, `UNAVAILABLE`), clinical urgency, and donation cooldowns (90-day cooldown).
2. **Emergency Escalation Radar**: Step-wise progressive radius expansion ($0\text{--}5\text{ km} \to 5\text{--}10\text{ km} \to 10\text{--}20\text{ km} \to 20\text{--}50\text{ km} \to \text{Blood Banks} \to \text{Hospitals}$) ensuring high-urgency needs are fulfilled without broadcast spam.
3. **Real-Time Blood Availability**: Live inventory management across all 8 blood groups and components (Whole Blood, PRBC, Platelets, FFP) with verification badges (`Available`, `Recently Updated`, `Needs Verification`, `Not Available`).
4. **Emergency Blood Relay**: Donors can pass/relay unserviceable emergency requests to the next nearest eligible donor without revealing private patient or donor contact details.
5. **Verified Emergency Request Lifecycle**:
   $$\text{DRAFT} \to \text{PENDING\_VERIFICATION} \to \text{VERIFIED} \to \text{ACTIVE} \to \text{MATCHING} \to \text{ACCEPTED} \to \text{IN\_PROGRESS} \to \text{FULFILLED}$$
6. **Smart Matching Score Formula**:
   $$\text{Score} = \text{Compatibility} (30) + \text{Distance} (25) + \text{Availability} (20) + \text{Urgency} (15) + \text{Eligibility} (10)$$
7. **End-to-End Live Tracking Timeline**: Step-by-step transparency from creation to matching, donor acceptance, hospital verification, and donation completion.

---

## 3. Technology Stack

- **Backend**: Node.js v24, Express.js, Socket.IO, node-cron
- **Database**: MongoDB via Mongoose (with embedded zero-friction `mongodb-memory-server` fallback)
- **Security**: JWT (Access + Refresh tokens), bcryptjs, Helmet, Express Rate Limiter, CORS
- **Mobile Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Socket.IO Client, Mobile Device Frame Simulator
- **Admin Portal**: React, Vite, Tailwind CSS, Analytical Visualizers
- **Testing**: Jest, Supertest

---

## 4. Complete Folder Structure

```text
hemolink/
├── mobile/                       # Mobile-first Web/PWA Application
│   ├── src/
│   │   ├── components/           # MobileFrame, Header, BottomNav, MedicalDisclaimer, OfflineBanner, DemoBar
│   │   ├── screens/
│   │   │   ├── auth/             # SplashScreen, OnboardingScreen, LoginScreen, RegisterScreen
│   │   │   ├── donor/            # DonorDashboard, EmergencyRequestsScreen, DonationHistoryScreen
│   │   │   ├── patient/          # PatientDashboard, CreateEmergencyRequestScreen, TrackRequestScreen
│   │   │   ├── hospital/         # HospitalDashboard (Verification & Check-in)
│   │   │   ├── bloodBank/        # BloodBankDashboard (Live Inventory)
│   │   │   └── common/           # NotificationsScreen, ProfileScreen
│   │   ├── context/              # AuthContext, SocketContext
│   │   ├── utils/                # api client, helpers
│   │   ├── constants/            # Blood groups, components, urgencies
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Express REST API & WebSockets
│   ├── src/
│   │   ├── config/               # database.js, environment.js, firebase.js
│   │   ├── controllers/          # auth, donor, patient, emergency, matching, hospital, bloodBank, admin
│   │   ├── models/               # User, DonorProfile, Hospital, BloodBank, BloodInventory, EmergencyRequest, DonorMatch, Donation, Notification, AuditLog
│   │   ├── routes/               # auth, donor, patient, emergency, matching, hospital, bloodBank, notification, admin
│   │   ├── services/             # matchingService, emergencyService, donorService, bloodBankService, notificationService, distanceService, verificationService
│   │   ├── middleware/           # auth, role, validation, error, rateLimit
│   │   ├── utils/                # bloodCompatibility, distanceCalculator, validators, responseHelper, seedData
│   │   ├── jobs/                 # escalationJob, expiryJob, reminderJob
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                    # Jest automated test suites
│   ├── package.json
│   └── .env.example
│
├── admin/                        # Administrative Governance Portal
│   ├── src/
│   │   ├── components/           # Sidebar, AdminHeader
│   │   ├── pages/                # DashboardOverview, UserManagement, HospitalVerification, BloodBankVerification, EmergencyMonitor, AuditLogs, SystemSettings
│   │   ├── services/             # adminApi
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/                         # Detailed Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── deployment.md
│
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
```

---

## 5. Quick Start & Installation

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
npm --prefix backend install
npm --prefix mobile install
npm --prefix admin install
```

### Step 2: Seed Realistic Demo Data
```bash
cd backend
npm run seed
```
This seeds:
- **25 Donors** with diverse blood groups, geolocations, and donation histories.
- **6 Hospitals** with emergency centers.
- **6 Blood Banks** with live inventory across all 8 blood groups and components.
- **10 Sample Emergency Requests** across different stages.
- **1 Default Administrator** account.

### Step 3: Run the Services
Open 3 terminal windows:

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
# Starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 — Mobile Application:**
```bash
cd mobile
npm run dev
# Starts on http://localhost:5173
```

**Terminal 3 — Admin Dashboard:**
```bash
cd admin
npm run dev
# Starts on http://localhost:5174
```

---

## 6. Demo Credentials

| Role | Email | Password | Persona Details |
|---|---|---|---|
| **Admin** | `admin@hemolink.org` | `Admin@123` | Dr. Sarah Mitchell (Chief Oversight) |
| **Donor (O+)** | `donor1@hemolink.org` | `Password@123` | Arun Kumar (Available, Cooldown Eligible) |
| **Donor (O- Univ)**| `donor2@hemolink.org` | `Password@123` | Priya Sharma (Universal RBC Donor) |
| **Donor (A+)** | `donor3@hemolink.org` | `Password@123` | Karthik Raja |
| **Patient** | `patient1@hemolink.org` | `Password@123` | Rajesh Attendant |
| **Hospital** | `hospital1@hemolink.org` | `Password@123` | Apollo Health City Emergency Center |
| **Blood Bank** | `bloodbank1@hemolink.org` | `Password@123` | Red Cross Central Blood Bank |

> [!TIP]
> In the mobile app, use the **Demo Quick Bar** at the top to switch between roles or click **"⚡ Run Complete End-to-End Emergency Flow"** to watch the entire workflow execute automatically in real time!

---

## 7. Automated Testing

Run the complete backend test suite:
```bash
cd backend
npm test
```

### Verified Test Coverage:
- `bloodCompatibility.test.js`: ABO/Rh matrix for RBC, Platelets, Plasma, invalid inputs, and safety disclaimer.
- `matchingAndDistance.test.js`: Haversine distance, composite scoring, urgency scaling, and donation cooldowns.
- `authAndRoles.test.js`: Registration, login, duplicate email prevention, invalid credentials, and role-based guards.
- `emergencyWorkflow.test.js`: Request creation, duplicate detection warning, donor acceptance, and hospital completion.
- `escalationAndInventory.test.js`: Tiered radius escalation and blood bank inventory CRUD.

```text
Test Suites: 5 passed, 5 total
Tests:       27 passed, 27 total
Snapshots:   0 total
```

---

## 8. Docker Deployment

Deploy the entire stack with containerized MongoDB:
```bash
docker-compose up --build -d
```
Access points:
- Backend: `http://localhost:5000`
- Mobile: `http://localhost:5173`
- Admin: `http://localhost:5174`

---

## 9. Future Scope
- AI-assisted demand forecasting and regional blood shortage prediction.
- Regional blood inventory heatmaps and GPS route optimization for dispatch.
- Multilingual accessibility (Tamil, Hindi, Telugu, Spanish, French voice navigation).
- Automated SMS and IVR fallback for donors in low-bandwidth regions.
- Digital donor recognition certificates with blockchain provenance verification.
