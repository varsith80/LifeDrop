# HemoLink REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (Donor, Patient, Hospital, Blood Bank) | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT tokens | No |
| `POST` | `/api/auth/logout` | Invalidate active session | Yes |
| `POST` | `/api/auth/refresh` | Obtain refreshed access token | No |
| `POST` | `/api/auth/forgot-password`| Request password reset code | No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit phone/email OTP | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & role data | Yes |

---

## 2. Donors (`/api/donors`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/donors/profile` | Get donor blood group, stats & eligibility | Yes (Donor) |
| `PUT` | `/api/donors/profile` | Update donor information & preferred radius | Yes (Donor) |
| `PATCH` | `/api/donors/availability` | Set status: `AVAILABLE`, `AVAILABLE_LATER`, `UNAVAILABLE` | Yes (Donor) |
| `GET` | `/api/donors/emergency-requests`| Get compatible emergency requests nearby | Yes (Donor) |
| `POST` | `/api/donors/requests/:id/accept` | Accept an emergency blood request | Yes (Donor) |
| `POST` | `/api/donors/requests/:id/reject` | Decline or relay request to next donor | Yes (Donor) |
| `GET` | `/api/donors/donations` | Fetch verified donation records & certificates | Yes (Donor) |

---

## 3. Emergency Requests (`/api/emergency` & `/api/patients`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/patients/requests` | Create new emergency blood need | Yes (Patient) |
| `GET` | `/api/patients/requests` | List user's emergency requests | Yes (Patient) |
| `GET` | `/api/patients/requests/:id/tracking`| Real-time step timeline and escalation radar | Yes |
| `POST` | `/api/patients/requests/:id/cancel` | Cancel an active emergency request | Yes (Patient) |
| `GET` | `/api/emergency` | Search active emergency requests | Public / Yes |
| `GET` | `/api/emergency/:id` | Get emergency request details | Public / Yes |
| `POST` | `/api/emergency/:id/verify` | Hospital verification of request | Yes (Hospital/Admin) |
| `POST` | `/api/emergency/:id/escalate` | Trigger radius expansion | Yes (Admin/Hospital) |

---

## 4. Matching Engine (`/api/matching`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/matching/find` | Calculate ranked compatible donors & blood banks | Public / Yes |
| `GET` | `/api/matching/request/:requestId` | Get computed matches for request | Yes |
| `POST` | `/api/matching/:matchId/respond` | Record donor response | Yes |

---

## 5. Hospitals (`/api/hospitals`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/hospitals` | List registered hospital centers | Public / Yes |
| `GET` | `/api/hospitals/my/profile` | Get current hospital facility profile | Yes (Hospital) |
| `GET` | `/api/hospitals/my/requests` | Get requests assigned to hospital | Yes (Hospital) |
| `POST` | `/api/hospitals/requests/:id/verify` | Approve or decline emergency request | Yes (Hospital) |
| `POST` | `/api/hospitals/requests/:id/confirm-donation` | Record donor arrival & verified collection | Yes (Hospital) |

---

## 6. Blood Banks (`/api/blood-banks`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/blood-banks` | List blood bank facilities | Public / Yes |
| `GET` | `/api/blood-banks/:id/inventory` | Browse live blood stock across 8 blood groups | Public / Yes |
| `POST` | `/api/blood-banks/:id/inventory` | Add new stock batch | Yes (Blood Bank) |
| `PUT` | `/api/blood-banks/:id/inventory/:invId` | Adjust available / reserved units | Yes (Blood Bank) |
| `DELETE` | `/api/blood-banks/:id/inventory/:invId` | Remove expired stock | Yes (Blood Bank) |

---

## 7. Administrative Oversight (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Aggregated system metrics & visualizer data | Yes (Admin) |
| `GET` | `/api/admin/users` | Filterable user directory | Yes (Admin) |
| `PATCH` | `/api/admin/users/:id/status` | Suspend or activate user accounts | Yes (Admin) |
| `GET` | `/api/admin/hospitals/pending` | List unverified hospital registrations | Yes (Admin) |
| `PATCH` | `/api/admin/hospitals/:id/verify` | Verify or reject hospital license | Yes (Admin) |
| `GET` | `/api/admin/blood-banks/pending` | List unverified blood banks | Yes (Admin) |
| `PATCH` | `/api/admin/blood-banks/:id/verify` | Verify or reject blood bank | Yes (Admin) |
| `GET` | `/api/admin/emergency-requests` | Full emergency monitoring feed | Yes (Admin) |
| `GET` | `/api/admin/audit-logs` | Immutable audit trail records | Yes (Admin) |
