const {
  isBloodCompatible,
  getCompatibleDonorGroups,
  MEDICAL_SAFETY_DISCLAIMER,
  VALID_BLOOD_GROUPS,
} = require('../src/utils/bloodCompatibility');

describe('Medical Blood Compatibility Engine', () => {
  test('includes mandatory medical safety rule disclaimer', () => {
    expect(MEDICAL_SAFETY_DISCLAIMER).toBe(
      'Blood compatibility and transfusion decisions must be confirmed by an authorized medical professional or blood bank.'
    );
  });

  describe('Universal Donor and Recipient Rules (RBC / Whole Blood)', () => {
    test('O- is universal RBC donor (can donate to all 8 blood groups)', () => {
      VALID_BLOOD_GROUPS.forEach((recipientGroup) => {
        expect(isBloodCompatible('O-', recipientGroup, 'WHOLE_BLOOD')).toBe(true);
      });
    });

    test('AB+ is universal RBC recipient (can receive from all 8 blood groups)', () => {
      VALID_BLOOD_GROUPS.forEach((donorGroup) => {
        expect(isBloodCompatible(donorGroup, 'AB+', 'WHOLE_BLOOD')).toBe(true);
      });
    });

    test('O- recipient can ONLY receive from O- donors', () => {
      const compatible = getCompatibleDonorGroups('O-', 'WHOLE_BLOOD');
      expect(compatible).toEqual(['O-']);
      expect(isBloodCompatible('O+', 'O-')).toBe(false);
      expect(isBloodCompatible('A-', 'O-')).toBe(false);
      expect(isBloodCompatible('B-', 'O-')).toBe(false);
    });

    test('A+ recipient can receive from O-, O+, A-, A+', () => {
      const compatible = getCompatibleDonorGroups('A+', 'WHOLE_BLOOD');
      expect(compatible.sort()).toEqual(['A+', 'A-', 'O+', 'O-'].sort());
      expect(isBloodCompatible('B+', 'A+')).toBe(false);
      expect(isBloodCompatible('AB+', 'A+')).toBe(false);
    });

    test('B+ recipient can receive from O-, O+, B-, B+', () => {
      const compatible = getCompatibleDonorGroups('B+', 'WHOLE_BLOOD');
      expect(compatible.sort()).toEqual(['B+', 'B-', 'O+', 'O-'].sort());
      expect(isBloodCompatible('A+', 'B+')).toBe(false);
    });
  });

  describe('Fresh Frozen Plasma (FFP) Compatibility', () => {
    test('AB is universal Plasma donor', () => {
      VALID_BLOOD_GROUPS.forEach((recipientGroup) => {
        expect(isBloodCompatible('AB+', recipientGroup, 'FRESH_FROZEN_PLASMA')).toBe(true);
      });
    });
  });

  describe('Input validation safeguards', () => {
    test('rejects invalid blood groups', () => {
      expect(isBloodCompatible('XYZ', 'O+')).toBe(false);
      expect(isBloodCompatible('O+', 'INVALID')).toBe(false);
      expect(getCompatibleDonorGroups('UNKNOWN')).toEqual([]);
    });
  });
});
