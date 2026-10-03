# HemoLink Database Schema Specification

Database Engine: **MongoDB**  
Database Name: `hemolinkDB`

---

## 1. Schema Definitions

### `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `name` | String | Full user name |
| `email` | String (unique, index) | Email address |
| `phone` | String | Verified contact phone |
| `passwordHash` | String | Bcrypt salted hash |
| `role` | Enum | `DONOR`, `PATIENT`, `HOSPITAL`, `BLOOD_BANK`, `ADMIN` |
| `profileImage`| String | Avatar / image URI |
| `isVerified` | Boolean | Identity verification flag |
| `isActive` | Boolean | Account status (active/suspended) |
| `createdAt` | Date | Record timestamp |
| `lastLoginAt` | Date | Recent login tracking |

---

### `donorProfiles`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId (ref: User) | Associated account |
| `bloodGroup` | String (index) | ABO/Rh group (`O+`, `O-`, `A+`, etc.) |
| `dateOfBirth` | Date | Age verification |
| `gender` | Enum | Gender representation |
| `location` | String | Human readable area / city |
| `latitude` | Number (index) | Geographic latitude |
| `longitude` | Number (index) | Geographic longitude |
| `availabilityStatus` | Enum (index) | `AVAILABLE`, `AVAILABLE_LATER`, `UNAVAILABLE` |
| `lastDonationDate` | Date | Cooldown baseline |
| `donationCount`| Number | Total verified donations |
| `eligibilityStatus` | Enum | `ELIGIBLE`, `COOLDOWN`, `INELIGIBLE` |
| `preferredRadius` | Number | Maximum alert distance (km) |

---

### `emergencyRequests`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `requesterId`| ObjectId (ref: User) | Patient / Attendant who created request |
| `hospitalId` | ObjectId (ref: Hospital) | Medical center handling transfusion |
| `patientName`| String | Patient identifier / ward |
| `bloodGroup` | String (index) | Required blood group |
| `componentType` | Enum | Whole Blood, PRBC, Platelets, FFP |
| `unitsRequired` | Number | Target units |
| `unitsFulfilled`| Number | Collected & confirmed units |
| `urgency` | Enum | `CRITICAL`, `IMMEDIATE`, `HIGH`, `MEDIUM` |
| `status` | Enum (index) | `MATCHING`, `ACCEPTED`, `IN_PROGRESS`, `FULFILLED`, `CANCELLED`, `EXPIRED` |
| `verificationStatus` | Enum | `PENDING`, `VERIFIED`, `REJECTED` |
| `currentRadius` | Number | Active escalation radius (km) |
| `escalationTier`| Number | Current escalation level (1 to 6) |
| `acceptedDonorId`| ObjectId (ref: User)| Committed donor |
| `expiresAt` | Date (index) | Stale threshold timestamp |

---

### `bloodInventory`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `bloodBankId` | ObjectId (ref: BloodBank)| Managing facility |
| `bloodGroup` | String (index) | Blood group in stock |
| `componentType`| Enum | Component classification |
| `availableUnits`| Number | Real-time ready units |
| `reservedUnits` | Number | Allocated units |
| `expiryDate` | Date (index) | Shelf-life expiration |
| `lastUpdated` | Date (index) | Freshness tracking |
| `verificationStatus` | Enum | `Available`, `Recently Updated`, `Not Available`, `Needs Verification` |

---

### `auditLogs`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId (ref: User) | Actor who triggered operation |
| `action` | String (index) | Event type (e.g. `Login`, `Request Created`, `Donation Confirmed`) |
| `entityType` | String (index) | Target model (e.g. `EmergencyRequest`, `Hospital`) |
| `entityId` | String | Target identifier |
| `metadata` | Mixed | Event context payload |
| `ipAddress` | String | Network address |
| `createdAt` | Date (index) | Immutable timestamp |
