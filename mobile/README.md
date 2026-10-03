# HemoLink Mobile Application

A modern, responsive, mobile-first health-tech application for coordinating emergency blood donations and verifying blood availability.

## Features
- **Mobile Device Frame Simulator**: Realistic smartphone bezel preview with notch, status bar, and toggle to full responsive mode.
- **Role-Aware Portals**:
  - **Donor**: Availability toggle (`AVAILABLE`, `AVAILABLE_LATER`, `UNAVAILABLE`), emergency requests, next donation eligibility counter, donation journey badges.
  - **Patient / Attendant**: `🚨 NEED BLOOD NOW` high-visibility emergency action, duplicate prevention warning, live step-by-step progress timeline, escalation radar.
  - **Hospital**: Medical request verification engine, donor check-in, donation confirmation.
  - **Blood Bank**: Real-time stock overview across all 8 blood groups and components, stock adjustment controls, verification badges.
- **One-Tap Demo Switcher**: Instant switching between Donor, Universal Donor (O-), Patient, Hospital, and Blood Bank accounts.
- **⚡ End-to-End Automation Runner**: 1-click button that simulates a full emergency flow from Patient request to Hospital verification, Donor acceptance, and Hospital collection in under 30 seconds.
- **Real-Time Push & Socket.IO**: Live in-app notifications and connection status monitor.
- **Offline Guard**: Graceful handling of poor connectivity with retry indicators.

## Running Locally
```bash
npm install
npm run dev
# Running on http://localhost:5173
```
