# HemoLink Architecture & System Design

**Tagline**: *“The right blood. The right donor. At the right time.”*

HemoLink is a real-time blood donation and emergency blood availability platform engineered to coordinate critical blood transfusion requests across donors, patients, hospitals, and blood banks.

---

## 1. High-Level Architecture

```
  ┌────────────────────────────────────────────────────────┐
  │                 Client Applications                     │
  │  ┌─────────────────────────┐ ┌───────────────────────┐ │
  │  │   Mobile Application    │ │    Admin Dashboard    │ │
  │  │ (Donor/Patient/Hospital)│ │  (Clinical Oversight) │ │
  │  └───────────┬─────────────┘ └───────────┬───────────┘ │
  └──────────────┼───────────────────────────┼─────────────┘
                 │ REST / WebSockets         │
                 ▼                           ▼
  ┌────────────────────────────────────────────────────────┐
  │            HemoLink API Gateway / Express               │
  │  ┌───────────────────────────────────────────────────┐ │
  │  │ Middleware: JWT Auth, RBAC, Helmet, Rate Limiter  │ │
  │  └──────────────────────────┬────────────────────────┘ │
  │                             │                          │
  │  ┌──────────────────────────▼────────────────────────┐ │
  │  │                 Core Business Services            │ │
  │  │  • Medical Compatibility Engine (Predefined Rules)│ │
  │  │  • Smart Matching & Composite Scoring Engine      │ │
  │  │  • Automatic Emergency Escalation Radar (0-50km+) │ │
  │  │  • Real-Time Blood Inventory & Verification       │ │
  │  │  • Real-Time Notification & Socket.IO Dispatcher  │ │
  │  │  • Security & Operational Audit Logger            │ │
  │  └──────────────────────────┬────────────────────────┘ │
  └─────────────────────────────┼──────────────────────────┘
                                │
                                ▼
  ┌────────────────────────────────────────────────────────┐
  │                 MongoDB Database (hemolinkDB)          │
  │  • Users             • DonorProfiles    • Hospitals    │
  │  • BloodBanks        • BloodInventory   • Emergencies  │
  │  • DonorMatches      • Donations        • AuditLogs    │
  └────────────────────────────────────────────────────────┘
```

---

## 2. Important Medical Safety Rule

> [!IMPORTANT]
> **Clinical Transfusion Safeguard**:
> The system **does NOT allow AI to independently make clinical transfusion decisions**. Blood compatibility is governed by an immutable, medically validated ABO/Rh rules engine and must be confirmed by an authorized medical professional or blood bank.
>
> All screens display the mandatory notice:
> *“Blood compatibility and transfusion decisions must be confirmed by an authorized medical professional or blood bank.”*

---

## 3. Core Innovations

### Innovation 1 — Smart Emergency Matching
Combines medical compatibility, proximity distance (Haversine formula), donor live availability, clinical urgency, and donation cooldowns (90-day cooldown) to compute a normalized match score ($0\text{--}100$).

$$\text{Match Score} = \text{Compatibility} (30) + \text{Distance Factor} (25) + \text{Availability} (20) + \text{Urgency} (15) + \text{Eligibility} (10)$$

### Innovation 2 — Automatic Emergency Escalation
If an urgent request is not fulfilled within the configured interval (e.g. 5 minutes), the background cron job expands the search radius in progressive rings without spamming irrelevant users:
1. **Tier 1**: $0\text{--}5\text{ km}$ (Immediate neighborhood)
2. **Tier 2**: $5\text{--}10\text{ km}$ (Local district)
3. **Tier 3**: $10\text{--}20\text{ km}$ (Metro region)
4. **Tier 4**: $20\text{--}50\text{ km}$ (Regional radius)
5. **Tier 5**: Registered Blood Bank Inventory Broadcast
6. **Tier 6**: Partner Hospital Trauma Network Broadcast

### Innovation 3 — Real-Time Blood Inventory
Blood bank inventories track:
- Available units vs. reserved units
- Expiration dates (e.g. 5 days for platelets, 35 days for whole blood)
- Verification statuses: `Available`, `Recently Updated`, `Needs Verification`, `Not Available`

### Innovation 4 — Emergency Blood Relay
If a notified donor is unavailable, they can trigger the donor relay action to automatically pass the emergency to the next closest eligible donor without disclosing private patient or donor contact details.

### Innovation 5 — Verified Emergency Requests
Request lifecycle states:
$$\text{DRAFT} \to \text{PENDING\_VERIFICATION} \to \text{VERIFIED} \to \text{ACTIVE} \to \text{MATCHING} \to \text{ACCEPTED} \to \text{IN\_PROGRESS} \to \text{FULFILLED}$$

---

## 4. Security & Compliance
- **Password Protection**: Passwords salted and hashed with `bcryptjs` (10 rounds).
- **Authentication**: Stateless JSON Web Tokens (Access token: 7d, Refresh token: 30d).
- **Role-Based Access Control**: Strict role separation (`DONOR`, `PATIENT`, `HOSPITAL`, `BLOOD_BANK`, `ADMIN`).
- **Audit Trail**: All critical operations (logins, emergency creations, hospital verifications, donation confirmations) write immutable records to the `auditLogs` collection with timestamps, actor IDs, and IP addresses.
- **Privacy Guard**: Exact geographic coordinates of donors are protected; only approximate distances and area labels are shown prior to authorization.
