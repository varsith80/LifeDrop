# HemoLink Admin Dashboard

Administrative Oversight and Clinical Governance Portal for HemoLink.

## Features
- **Real-Time Analytics Overview**: Total donors, active available donors, emergency requests, active emergencies, licensed blood banks, hospitals, and transfusion completion rates.
- **Visual Analytics**:
  - Emergency blood requests grouped by ABO/Rh group
  - Live blood bank inventory distribution
  - Urgency and status breakdown
- **User Management**: Filter by role, search, activate or suspend accounts.
- **Hospital License Verification**: Review medical registration numbers and approve or decline hospital accounts.
- **Blood Bank Verification**: Review licensing and authorize inventory broadcasts.
- **Emergency Requests Live Monitor**: Monitor active emergencies, current escalation tiers, and trigger manual radius expansions.
- **Security & Operational Audit Trail**: Searchable, filterable log of platform actions with IP address and metadata.
- **System Settings**: Configurable escalation intervals and radius thresholds.

## Running Locally
```bash
npm install
npm run dev
# Running on http://localhost:5174
```
Demo Admin Credentials: `admin@hemolink.org` / `Admin@123`
