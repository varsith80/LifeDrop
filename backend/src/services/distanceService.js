const { calculateDistance, getBoundingBox } = require('../utils/distanceCalculator');

class DistanceService {
  /**
   * Calculate distance between point A and B in kilometers.
   */
  getDistance(lat1, lon1, lat2, lon2) {
    return calculateDistance(lat1, lon1, lat2, lon2);
  }

  /**
   * Filter items that fall within radiusKm.
   */
  filterWithinRadius(items, centerLat, centerLon, radiusKm) {
    return items
      .map((item) => {
        const itemLat = item.latitude || (item.location && item.location.latitude);
        const itemLon = item.longitude || (item.location && item.location.longitude);
        const dist = calculateDistance(centerLat, centerLon, itemLat, itemLon);
        return {
          ...item,
          distance: dist,
        };
      })
      .filter((item) => item.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}

module.exports = new DistanceService();
