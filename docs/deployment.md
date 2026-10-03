# HemoLink Deployment & Operations Guide

## 1. Prerequisites
- Node.js >= 18.0.0 (tested on Node v24)
- npm >= 9.0.0
- Docker & Docker Compose (optional for containerized deployment)
- MongoDB >= 6.0 (or automatic embedded in-memory database for local development)

---

## 2. Quick Local Start (Bare Metal)

### Step 1: Install Dependencies
```bash
# In project root
npm install
npm --prefix backend install
npm --prefix mobile install
npm --prefix admin install
```

### Step 2: Seed the Database
```bash
cd backend
npm run seed
```
This loads:
- 25 realistic Donors with geolocations and donation records
- 6 verified Hospitals
- 6 Blood Banks with full inventory across all 8 blood groups
- 10 active and historical Emergency Requests
- Admin user (`admin@hemolink.org` / `Admin@123`)

### Step 3: Run the Services
Open 3 terminal windows or run background tasks:

**Terminal 1 (Backend API & Socket.IO):**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Mobile Application):**
```bash
cd mobile
npm run dev
# Running on http://localhost:5173
```

**Terminal 3 (Admin Dashboard):**
```bash
cd admin
npm run dev
# Running on http://localhost:5174
```

---

## 3. Docker Compose Deployment

Run the complete multi-tier system with single command:
```bash
docker-compose up --build -d
```

This starts:
- `hemolink-mongodb`: MongoDB container on port `27017`
- `hemolink-backend`: Express REST API on port `5000`
- `hemolink-mobile`: Mobile web application on port `5173`
- `hemolink-admin`: Administrative portal on port `5174`

To stop:
```bash
docker-compose down
```

---

## 4. Production Environment Configuration

In production, create a `.env` file in `backend/` with secure values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hemolinkDB?retryWrites=true&w=majority
JWT_SECRET=generate_a_very_secure_random_64_character_hex_key
JWT_REFRESH_SECRET=generate_another_distinct_secure_random_key
NODE_ENV=production
CLIENT_URL=https://app.hemolink.org
ADMIN_URL=https://admin.hemolink.org
ESCALATION_INTERVAL_MINUTES=5
```
