const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');
const BloodInventory = require('../models/BloodInventory');
const EmergencyRequest = require('../models/EmergencyRequest');
const DonorMatch = require('../models/DonorMatch');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Metro Center coordinates (Chennai / Central Metro: ~13.0827, 80.2707)
const BASE_LAT = 13.0827;
const BASE_LON = 80.2707;

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const componentTypes = ['WHOLE_BLOOD', 'PACKED_RED_BLOOD_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA'];

const seed = async (disconnectAfter = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seed] Connecting to database...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      DonorProfile.deleteMany({}),
      Hospital.deleteMany({}),
      BloodBank.deleteMany({}),
      BloodInventory.deleteMany({}),
      EmergencyRequest.deleteMany({}),
      DonorMatch.deleteMany({}),
      Donation.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. Sarah Mitchell (Chief Admin)',
      email: 'admin@hemolink.org',
      phone: '+1 800 555 0100',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    });
    console.log(`[Seed] Admin created: admin@hemolink.org / Admin@123`);

    // 2. Create 6 Hospitals
    const hospitalData = [
      {
        name: 'Apollo Health City Hospital',
        reg: 'HOSP-APOLLO-001',
        address: '21 Greams Lane, Thousand Lights',
        city: 'Chennai',
        lat: BASE_LAT + 0.012,
        lon: BASE_LON - 0.015,
        phone: '+91 44 2829 0200',
        email: 'emergency@apollohealth.org',
      },
      {
        name: 'Fortis Malar Emergency Hospital',
        reg: 'HOSP-FORTIS-002',
        address: '52 1st Main Rd, Gandhi Nagar, Adyar',
        city: 'Chennai',
        lat: BASE_LAT - 0.052,
        lon: BASE_LON + 0.021,
        phone: '+91 44 4289 2222',
        email: 'er@fortismalar.org',
      },
      {
        name: 'Government General Hospital (RGGGH)',
        reg: 'HOSP-RGGGH-003',
        address: 'EVR Periyar Salai, Park Town',
        city: 'Chennai',
        lat: BASE_LAT + 0.005,
        lon: BASE_LON + 0.003,
        phone: '+91 44 2530 5000',
        email: 'trauma@rgggh.gov.in',
      },
      {
        name: 'MIOT International Trauma Care',
        reg: 'HOSP-MIOT-004',
        address: '4/112 Mount Poonamallee Rd, Manapakkam',
        city: 'Chennai',
        lat: BASE_LAT - 0.081,
        lon: BASE_LON - 0.065,
        phone: '+91 44 4200 2288',
        email: 'bloodcenter@miot.org',
      },
      {
        name: 'Kauvery Emergency & Trauma Hospital',
        reg: 'HOSP-KAUVERY-005',
        address: '199 Luz Church Rd, Mylapore',
        city: 'Chennai',
        lat: BASE_LAT - 0.038,
        lon: BASE_LON - 0.008,
        phone: '+91 44 4000 6000',
        email: 'transfusion@kauvery.org',
      },
      {
        name: 'Gleneagles Global Health City',
        reg: 'HOSP-GLOBAL-006',
        address: '439 Cheran Nagar, Perumbakkam',
        city: 'Chennai',
        lat: BASE_LAT - 0.125,
        lon: BASE_LON + 0.045,
        phone: '+91 44 4477 7000',
        email: 'er@gleneaglesglobal.org',
      },
    ];

    const hospitals = [];
    for (let i = 0; i < hospitalData.length; i++) {
      const h = hospitalData[i];
      const hUser = await User.create({
        name: h.name,
        email: `hospital${i + 1}@hemolink.org`,
        phone: h.phone,
        passwordHash: defaultPasswordHash,
        role: 'HOSPITAL',
        isVerified: true,
        isActive: true,
      });

      const hospitalDoc = await Hospital.create({
        userId: hUser._id,
        hospitalName: h.name,
        registrationNumber: h.reg,
        address: h.address,
        city: h.city,
        state: 'Tamil Nadu',
        pincode: '600006',
        latitude: h.lat,
        longitude: h.lon,
        phone: h.phone,
        email: h.email,
        verificationStatus: 'VERIFIED',
      });
      hospitals.push(hospitalDoc);
    }
    console.log(`[Seed] Created ${hospitals.length} hospitals.`);

    // 3. Create 6 Blood Banks with live inventories
    const bloodBankData = [
      {
        name: 'Red Cross Central Blood Bank',
        reg: 'BB-RC-101',
        address: '50 Montieth Rd, Egmore',
        city: 'Chennai',
        lat: BASE_LAT + 0.008,
        lon: BASE_LON - 0.012,
        phone: '+91 44 2855 4548',
        email: 'blood@redcross-egmore.org',
      },
      {
        name: 'Rotary Central TTK Blood Bank',
        reg: 'BB-ROTARY-102',
        address: '130 Marshalls Rd, Egmore',
        city: 'Chennai',
        lat: BASE_LAT + 0.015,
        lon: BASE_LON - 0.008,
        phone: '+91 44 2855 4545',
        email: 'inventory@rotaryblood.org',
      },
      {
        name: 'Jeevan Regional Blood Bank',
        reg: 'BB-JEEVAN-103',
        address: '22 Lions Blood Bank Rd, T. Nagar',
        city: 'Chennai',
        lat: BASE_LAT - 0.035,
        lon: BASE_LON - 0.028,
        phone: '+91 44 2834 5066',
        email: 'support@jeevanbloodbank.org',
      },
      {
        name: 'South Metro Life Blood Bank',
        reg: 'BB-SML-104',
        address: '14 LB Road, Thiruvanmiyur',
        city: 'Chennai',
        lat: BASE_LAT - 0.089,
        lon: BASE_LON + 0.031,
        phone: '+91 44 2441 5566',
        email: 'ops@southmetrolife.org',
      },
      {
        name: 'Tambaram Community Blood Center',
        reg: 'BB-TAMB-105',
        address: '88 GST Road, Tambaram Sanatorium',
        city: 'Chennai',
        lat: BASE_LAT - 0.165,
        lon: BASE_LON - 0.075,
        phone: '+91 44 2241 1234',
        email: 'tambaram@bloodbank.org',
      },
      {
        name: 'City Apex Blood Transfusion Service',
        reg: 'BB-APEX-106',
        address: '77 Poonamallee High Rd, Kilpauk',
        city: 'Chennai',
        lat: BASE_LAT + 0.025,
        lon: BASE_LON - 0.032,
        phone: '+91 44 2642 9988',
        email: 'apex@bloodservice.org',
      },
    ];

    const bloodBanks = [];
    for (let i = 0; i < bloodBankData.length; i++) {
      const b = bloodBankData[i];
      const bUser = await User.create({
        name: b.name,
        email: `bloodbank${i + 1}@hemolink.org`,
        phone: b.phone,
        passwordHash: defaultPasswordHash,
        role: 'BLOOD_BANK',
        isVerified: true,
        isActive: true,
      });

      const bankDoc = await BloodBank.create({
        userId: bUser._id,
        name: b.name,
        registrationNumber: b.reg,
        address: b.address,
        city: b.city,
        state: 'Tamil Nadu',
        pincode: '600008',
        latitude: b.lat,
        longitude: b.lon,
        phone: b.phone,
        email: b.email,
        verificationStatus: 'VERIFIED',
      });
      bloodBanks.push(bankDoc);

      // Create rich inventory across blood groups and components
      for (const group of bloodGroups) {
        for (const comp of ['WHOLE_BLOOD', 'PACKED_RED_BLOOD_CELLS', 'PLATELETS']) {
          const avail = Math.floor(Math.random() * 12) + 2; // 2 to 14 units
          const reserved = Math.floor(Math.random() * 3);
          const expiryDays = comp === 'PLATELETS' ? 5 : 35;

          await BloodInventory.create({
            bloodBankId: bankDoc._id,
            bloodGroup: group,
            componentType: comp,
            availableUnits: avail,
            reservedUnits: reserved,
            expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 12) * 60 * 60 * 1000),
            verificationStatus: 'Recently Updated',
          });
        }
      }
    }
    console.log(`[Seed] Created ${bloodBanks.length} blood banks with inventory.`);

    // 4. Create 25 Realistic Donors
    const donorNames = [
      { name: 'Arun Kumar', group: 'O+', gender: 'MALE', phone: '+91 98401 11221', offsetLat: 0.015, offsetLon: 0.010, daysAgo: 120 },
      { name: 'Priya Sharma', group: 'O-', gender: 'FEMALE', phone: '+91 98401 11222', offsetLat: -0.012, offsetLon: 0.005, daysAgo: 105 },
      { name: 'Karthik Raja', group: 'A+', gender: 'MALE', phone: '+91 98401 11223', offsetLat: 0.022, offsetLon: -0.015, daysAgo: null },
      { name: 'Deepa Subramanian', group: 'A-', gender: 'FEMALE', phone: '+91 98401 11224', offsetLat: -0.025, offsetLon: -0.010, daysAgo: 95 },
      { name: 'Siddharth Iyer', group: 'B+', gender: 'MALE', phone: '+91 98401 11225', offsetLat: 0.005, offsetLon: 0.025, daysAgo: 140 },
      { name: 'Ananya Roy', group: 'B-', gender: 'FEMALE', phone: '+91 98401 11226', offsetLat: -0.035, offsetLon: 0.018, daysAgo: 40 }, // Cooldown!
      { name: 'Venkatesh Prasad', group: 'AB+', gender: 'MALE', phone: '+91 98401 11227', offsetLat: 0.040, offsetLon: 0.005, daysAgo: null },
      { name: 'Sneha Reddy', group: 'AB-', gender: 'FEMALE', phone: '+91 98401 11228', offsetLat: -0.018, offsetLon: -0.030, daysAgo: 150 },
      { name: 'Rahul Sundaram', group: 'O+', gender: 'MALE', phone: '+91 98401 11229', offsetLat: 0.028, offsetLon: 0.032, daysAgo: 110 },
      { name: 'Divya Nambiar', group: 'O+', gender: 'FEMALE', phone: '+91 98401 11230', offsetLat: -0.042, offsetLon: 0.022, daysAgo: 92 },
      { name: 'Manoj Menon', group: 'O-', gender: 'MALE', phone: '+91 98401 11231', offsetLat: 0.010, offsetLon: -0.020, daysAgo: null },
      { name: 'Lavanya Swaminathan', group: 'A+', gender: 'FEMALE', phone: '+91 98401 11232', offsetLat: -0.015, offsetLon: 0.040, daysAgo: 130 },
      { name: 'Gautam Chari', group: 'A+', gender: 'MALE', phone: '+91 98401 11233', offsetLat: 0.035, offsetLon: -0.025, daysAgo: 25 }, // Cooldown!
      { name: 'Nandini Joshi', group: 'B+', gender: 'FEMALE', phone: '+91 98401 11234', offsetLat: -0.050, offsetLon: -0.015, daysAgo: 100 },
      { name: 'Vijay Anand', group: 'B+', gender: 'MALE', phone: '+91 98401 11235', offsetLat: 0.018, offsetLon: 0.015, daysAgo: 98 },
      { name: 'Rohit Balaji', group: 'O+', gender: 'MALE', phone: '+91 98401 11236', offsetLat: -0.008, offsetLon: -0.012, daysAgo: null },
      { name: 'Meera Krishnan', group: 'A-', gender: 'FEMALE', phone: '+91 98401 11237', offsetLat: 0.045, offsetLon: 0.010, daysAgo: 160 },
      { name: 'Harish Babu', group: 'B-', gender: 'MALE', phone: '+91 98401 11238', offsetLat: -0.030, offsetLon: 0.035, daysAgo: 115 },
      { name: 'Kavitha Selvam', group: 'AB+', gender: 'FEMALE', phone: '+91 98401 11239', offsetLat: 0.012, offsetLon: -0.040, daysAgo: null },
      { name: 'Sanjay Varma', group: 'O-', gender: 'MALE', phone: '+91 98401 11240', offsetLat: -0.060, offsetLon: 0.010, daysAgo: 180 },
      { name: 'Shreya Sengupta', group: 'O+', gender: 'FEMALE', phone: '+91 98401 11241', offsetLat: 0.055, offsetLon: -0.018, daysAgo: 91 },
      { name: 'Aditya Narayanan', group: 'A+', gender: 'MALE', phone: '+91 98401 11242', offsetLat: -0.022, offsetLon: 0.012, daysAgo: 102 },
      { name: 'Revathi Murthy', group: 'B+', gender: 'FEMALE', phone: '+91 98401 11243', offsetLat: 0.020, offsetLon: 0.038, daysAgo: null },
      { name: 'Ashok Pillai', group: 'AB-', gender: 'MALE', phone: '+91 98401 11244', offsetLat: -0.048, offsetLon: -0.032, daysAgo: 125 },
      { name: 'Swetha Ramasamy', group: 'O+', gender: 'FEMALE', phone: '+91 98401 11245', offsetLat: 0.008, offsetLon: 0.008, daysAgo: 145 },
    ];

    const donors = [];
    for (let i = 0; i < donorNames.length; i++) {
      const d = donorNames[i];
      const dUser = await User.create({
        name: d.name,
        email: `donor${i + 1}@hemolink.org`,
        phone: d.phone,
        passwordHash: defaultPasswordHash,
        role: 'DONOR',
        isVerified: true,
        isActive: true,
      });

      const lastDonation = d.daysAgo ? new Date(Date.now() - d.daysAgo * 24 * 60 * 60 * 1000) : null;
      const isEligible = !d.daysAgo || d.daysAgo >= 90;

      const profile = await DonorProfile.create({
        userId: dUser._id,
        bloodGroup: d.group,
        dateOfBirth: new Date('1996-05-15'),
        gender: d.gender,
        location: `Anna Nagar / Central Sector ${i + 1}, Chennai`,
        latitude: BASE_LAT + d.offsetLat,
        longitude: BASE_LON + d.offsetLon,
        availabilityStatus: i === 5 ? 'UNAVAILABLE' : i === 12 ? 'AVAILABLE_LATER' : 'AVAILABLE',
        lastDonationDate: lastDonation,
        donationCount: d.daysAgo ? Math.floor(Math.random() * 6) + 1 : 0,
        eligibilityStatus: isEligible ? 'ELIGIBLE' : 'COOLDOWN',
        preferredRadius: 20,
        notificationEnabled: true,
      });
      donors.push({ user: dUser, profile });
    }
    console.log(`[Seed] Created ${donors.length} donors.`);

    // 5. Create 3 Patients
    const patients = [];
    for (let i = 1; i <= 3; i++) {
      const pUser = await User.create({
        name: `Rajesh Attendant ${i}`,
        email: `patient${i}@hemolink.org`,
        phone: `+91 99401 2233${i}`,
        passwordHash: defaultPasswordHash,
        role: 'PATIENT',
        isVerified: true,
        isActive: true,
      });
      patients.push(pUser);
    }
    console.log(`[Seed] Created ${patients.length} patients.`);

    // 6. Create 10 Emergency Requests in Various Lifecycle States
    const sampleRequests = [
      {
        patientName: 'Kameshwar Rao (Cardiac ICU)',
        bloodGroup: 'O+',
        unitsRequired: 2,
        unitsFulfilled: 0,
        urgency: 'CRITICAL',
        status: 'MATCHING',
        hospitalIdx: 0,
        patientIdx: 0,
        hoursAgo: 1,
        tier: 1,
        radius: 5,
      },
      {
        patientName: 'Baby Aaradhya (Pediatric Trauma)',
        bloodGroup: 'O-',
        unitsRequired: 1,
        unitsFulfilled: 0,
        urgency: 'CRITICAL',
        status: 'ACTIVE',
        hospitalIdx: 1,
        patientIdx: 1,
        hoursAgo: 2,
        tier: 2,
        radius: 10,
      },
      {
        patientName: 'Subhash Chandra (Orthopedic Surgery)',
        bloodGroup: 'A+',
        unitsRequired: 3,
        unitsFulfilled: 1,
        urgency: 'HIGH',
        status: 'ACCEPTED',
        hospitalIdx: 2,
        patientIdx: 2,
        hoursAgo: 4,
        tier: 1,
        radius: 5,
        acceptedDonorIdx: 2,
      },
      {
        patientName: 'Vani Jayaram (Maternity Emergency)',
        bloodGroup: 'B+',
        unitsRequired: 2,
        unitsFulfilled: 2,
        urgency: 'IMMEDIATE',
        status: 'FULFILLED',
        hospitalIdx: 3,
        patientIdx: 0,
        hoursAgo: 18,
        tier: 1,
        radius: 5,
        acceptedDonorIdx: 4,
      },
      {
        patientName: 'Sundar Pichai (General Surgery)',
        bloodGroup: 'AB+',
        unitsRequired: 2,
        unitsFulfilled: 0,
        urgency: 'MEDIUM',
        status: 'PENDING_VERIFICATION',
        hospitalIdx: 4,
        patientIdx: 1,
        hoursAgo: 0.5,
        tier: 1,
        radius: 5,
      },
      {
        patientName: 'Geetha Raman (Acute Anemia)',
        bloodGroup: 'A-',
        unitsRequired: 2,
        unitsFulfilled: 0,
        urgency: 'HIGH',
        status: 'MATCHING',
        hospitalIdx: 0,
        patientIdx: 2,
        hoursAgo: 3,
        tier: 3,
        radius: 20,
      },
      {
        patientName: 'Ranganathan T (Accident Trauma)',
        bloodGroup: 'O+',
        unitsRequired: 4,
        unitsFulfilled: 1,
        urgency: 'CRITICAL',
        status: 'IN_PROGRESS',
        hospitalIdx: 1,
        patientIdx: 0,
        hoursAgo: 6,
        tier: 2,
        radius: 10,
        acceptedDonorIdx: 0,
      },
      {
        patientName: 'Kalaivani S (Oncology Support)',
        bloodGroup: 'B-',
        unitsRequired: 1,
        unitsFulfilled: 0,
        urgency: 'HIGH',
        status: 'ACTIVE',
        hospitalIdx: 2,
        patientIdx: 1,
        hoursAgo: 2,
        tier: 1,
        radius: 5,
      },
      {
        patientName: 'Manickam V (Expired Stale Demo)',
        bloodGroup: 'AB-',
        unitsRequired: 1,
        unitsFulfilled: 0,
        urgency: 'MEDIUM',
        status: 'EXPIRED',
        hospitalIdx: 3,
        patientIdx: 2,
        hoursAgo: 30,
        tier: 4,
        radius: 50,
      },
      {
        patientName: 'Pradeep Kumar (Cancelled Demo)',
        bloodGroup: 'O+',
        unitsRequired: 2,
        unitsFulfilled: 0,
        urgency: 'MEDIUM',
        status: 'CANCELLED',
        hospitalIdx: 4,
        patientIdx: 0,
        hoursAgo: 10,
        tier: 1,
        radius: 5,
      },
    ];

    for (const req of sampleRequests) {
      const hosp = hospitals[req.hospitalIdx];
      const pat = patients[req.patientIdx];
      const createdDate = new Date(Date.now() - req.hoursAgo * 60 * 60 * 1000);
      const expiresDate = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000);

      const acceptedDonor = req.acceptedDonorIdx !== undefined ? donors[req.acceptedDonorIdx].user._id : null;

      const emergencyDoc = await EmergencyRequest.create({
        requesterId: pat._id,
        hospitalId: hosp._id,
        patientName: req.patientName,
        bloodGroup: req.bloodGroup,
        componentType: 'WHOLE_BLOOD',
        unitsRequired: req.unitsRequired,
        unitsFulfilled: req.unitsFulfilled,
        urgency: req.urgency,
        requiredDate: new Date().toISOString().split('T')[0],
        requiredTime: 'ASAP / Immediate',
        location: hosp.hospitalName + ', ' + hosp.address,
        latitude: hosp.latitude,
        longitude: hosp.longitude,
        status: req.status,
        verificationStatus: ['VERIFIED', 'ACTIVE', 'MATCHING', 'ACCEPTED', 'IN_PROGRESS', 'FULFILLED'].includes(req.status)
          ? 'VERIFIED'
          : 'PENDING',
        currentRadius: req.radius,
        escalationTier: req.tier,
        acceptedDonorId: acceptedDonor,
        expiresAt: expiresDate,
        createdAt: createdDate,
        updatedAt: createdDate,
      });

      // If accepted or fulfilled, create DonorMatch and Donation record
      if (acceptedDonor) {
        await DonorMatch.create({
          requestId: emergencyDoc._id,
          donorId: acceptedDonor,
          matchScore: 94,
          distance: 2.4,
          matchStatus: req.status === 'FULFILLED' ? 'ACCEPTED' : 'ACCEPTED',
          notificationStatus: 'DELIVERED',
          response: 'ACCEPTED',
        });

        if (req.status === 'FULFILLED') {
          await Donation.create({
            donorId: acceptedDonor,
            hospitalId: hosp._id,
            requestId: emergencyDoc._id,
            units: req.unitsFulfilled,
            status: 'COMPLETED',
            verifiedBy: hosp.userId,
            donationDate: createdDate,
          });
        }
      }
    }
    console.log(`[Seed] Created ${sampleRequests.length} emergency requests.`);

    console.log(`\n=======================================================`);
    console.log(`🎉 HEMOLINK DATABASE SEED COMPLETE!`);
    console.log(`=======================================================`);
    console.log(`Demo Credentials:`);
    console.log(`  Admin:       admin@hemolink.org       / Admin@123`);
    console.log(`  Donor (O+):  donor1@hemolink.org      / Password@123 (Arun Kumar)`);
    console.log(`  Donor (O-):  donor2@hemolink.org      / Password@123 (Priya Sharma - Universal RBC)`);
    console.log(`  Donor (A+):  donor3@hemolink.org      / Password@123 (Karthik Raja)`);
    console.log(`  Hospital:    hospital1@hemolink.org   / Password@123 (Apollo Health City)`);
    console.log(`  Blood Bank:  bloodbank1@hemolink.org  / Password@123 (Red Cross Blood Bank)`);
    console.log(`  Patient:     patient1@hemolink.org    / Password@123 (Rajesh Attendant)`);
    console.log(`=======================================================\n`);

    if (disconnectAfter) {
      await disconnectDB();
      process.exit(0);
    }
    return { success: true };
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (disconnectAfter) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seed(true);
}

module.exports = seed;
