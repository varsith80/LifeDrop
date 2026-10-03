/**
 * HemoLink - Medical Blood Compatibility Rules
 * 
 * IMPORTANT MEDICAL SAFETY RULE:
 * Blood compatibility and transfusion decisions must be confirmed by an
 * authorized medical professional or blood bank.
 * 
 * Predefined medically approved rules for Whole Blood / Packed Red Blood Cells (PRBC),
 * Platelets, and Fresh Frozen Plasma (FFP).
 */

const MEDICAL_SAFETY_DISCLAIMER =
  'Blood compatibility and transfusion decisions must be confirmed by an authorized medical professional or blood bank.';

// Red Blood Cells (RBC / PRBC / Whole Blood) Compatibility
// Key rules:
// O- is universal RBC donor
// AB+ is universal RBC recipient
const RBC_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Which recipients can a donor give RBC to
const RBC_DONATION_TARGETS = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

// Plasma Compatibility (Fresh Frozen Plasma - FFP)
// Reverse of RBC:
// AB is universal Plasma donor
// O is universal Plasma recipient
const PLASMA_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

// Platelets Compatibility (prefer identical or compatible RBC/plasma rules)
const PLATELETS_COMPATIBILITY = {
  'O-': ['O-', 'O+'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'A+', 'O-', 'O+'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'B+', 'O-', 'O+'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'AB+', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

const VALID_BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const VALID_COMPONENT_TYPES = [
  'WHOLE_BLOOD',
  'PACKED_RED_BLOOD_CELLS',
  'PLATELETS',
  'FRESH_FROZEN_PLASMA',
  'CRYOPRECIPITATE',
];

/**
 * Check if donor blood is medically compatible for a recipient.
 * @param {string} donorGroup - e.g. "O-"
 * @param {string} recipientGroup - e.g. "A+"
 * @param {string} componentType - e.g. "WHOLE_BLOOD" or "PACKED_RED_BLOOD_CELLS"
 * @returns {boolean}
 */
const isBloodCompatible = (donorGroup, recipientGroup, componentType = 'WHOLE_BLOOD') => {
  if (!VALID_BLOOD_GROUPS.includes(donorGroup) || !VALID_BLOOD_GROUPS.includes(recipientGroup)) {
    return false;
  }

  // Exact match is always compatible
  if (donorGroup === recipientGroup) {
    return true;
  }

  if (componentType === 'FRESH_FROZEN_PLASMA') {
    const compatibleDonors = PLASMA_COMPATIBILITY[recipientGroup] || [];
    return compatibleDonors.includes(donorGroup);
  }

  if (componentType === 'PLATELETS') {
    const compatibleDonors = PLATELETS_COMPATIBILITY[recipientGroup] || [];
    return compatibleDonors.includes(donorGroup);
  }

  // Default to RBC / Whole Blood compatibility
  const compatibleDonors = RBC_COMPATIBILITY[recipientGroup] || [];
  return compatibleDonors.includes(donorGroup);
};

/**
 * Get all medically compatible donor groups for a given recipient and component.
 * @param {string} recipientGroup 
 * @param {string} componentType 
 * @returns {string[]}
 */
const getCompatibleDonorGroups = (recipientGroup, componentType = 'WHOLE_BLOOD') => {
  if (!VALID_BLOOD_GROUPS.includes(recipientGroup)) {
    return [];
  }

  if (componentType === 'FRESH_FROZEN_PLASMA') {
    return PLASMA_COMPATIBILITY[recipientGroup] || [];
  }

  if (componentType === 'PLATELETS') {
    return PLATELETS_COMPATIBILITY[recipientGroup] || [];
  }

  return RBC_COMPATIBILITY[recipientGroup] || [];
};

module.exports = {
  MEDICAL_SAFETY_DISCLAIMER,
  VALID_BLOOD_GROUPS,
  VALID_COMPONENT_TYPES,
  RBC_COMPATIBILITY,
  RBC_DONATION_TARGETS,
  PLASMA_COMPATIBILITY,
  PLATELETS_COMPATIBILITY,
  isBloodCompatible,
  getCompatibleDonorGroups,
};
