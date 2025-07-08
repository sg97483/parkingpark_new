interface Coordinates {
  lat: number;
  long: number;
}

export function getDistanceFromTwoPosition(from: Coordinates, to: Coordinates): number {
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const earthRadius = 6371; // Earth's radius in kilometers

  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLon = toRadians(to.long - from.long);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}
