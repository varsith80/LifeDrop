const { calculateDistance } = require('../src/utils/distanceCalculator');
const matchingService = require('../src/services/matchingService');

describe('Distance Calculator & Smart Matching Algorithm', () => {
  describe('Haversine Distance Calculator', () => {
    test('calculates correct distance between two known coordinates', () => {
      // Chennai Central (13.0827, 80.2707) to Marina Beach (13.0499, 80.2824) is ~4.0 km
      const dist = calculateDistance(13.0827, 80.2707, 13.0499, 80.2824);
      expect(dist).toBeGreaterThan(3.0);
      expect(dist).toBeLessThan(5.0);
    });

    test('returns 0 for identical coordinates', () => {
      expect(calculateDistance(13.0827, 80.2707, 13.0827, 80.2707)).toBe(0);
    });

    test('handles undefined/invalid coordinates gracefully', () => {
      expect(calculateDistance(null, undefined, 10, 20)).toBe(9999.0);
    });
  });

  describe('Smart Matching Score Computation', () => {
    test('gives highest score for exact blood match, near distance, available donor and critical urgency', () => {
      const score = matchingService.calculateScore({
        isExactMatch: true,
        distance: 1.0,
        radius: 15,
        availability: 'AVAILABLE',
        urgency: 'CRITICAL',
        daysSinceLastDonation: 120,
      });

      // 30 (exact) + 23 (dist) + 20 (avail) + 15 (critical) + 10 (eligible) = ~98
      expect(score).toBeGreaterThanOrEqual(95);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('penalizes unavailable donors and long distances', () => {
      const scoreAvailable = matchingService.calculateScore({
        isExactMatch: true,
        distance: 2.0,
        radius: 15,
        availability: 'AVAILABLE',
        urgency: 'HIGH',
        daysSinceLastDonation: 100,
      });

      const scoreLater = matchingService.calculateScore({
        isExactMatch: true,
        distance: 2.0,
        radius: 15,
        availability: 'AVAILABLE_LATER',
        urgency: 'HIGH',
        daysSinceLastDonation: 100,
      });

      expect(scoreAvailable).toBeGreaterThan(scoreLater);
    });

    test('gives cooldown penalty for donors who donated < 60 days ago', () => {
      const scoreEligible = matchingService.calculateScore({
        isExactMatch: true,
        distance: 2.0,
        radius: 15,
        availability: 'AVAILABLE',
        urgency: 'HIGH',
        daysSinceLastDonation: 95,
      });

      const scoreCooldown = matchingService.calculateScore({
        isExactMatch: true,
        distance: 2.0,
        radius: 15,
        availability: 'AVAILABLE',
        urgency: 'HIGH',
        daysSinceLastDonation: 30,
      });

      expect(scoreEligible - scoreCooldown).toBe(10);
    });
  });
});
