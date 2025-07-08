import {deg2rad} from './getMyLocation';

export const buildDistanceQuery = (lat: number, lng: number): string => {
  const cosLat = Math.cos(deg2rad(lat));
  const sinLat = Math.sin(deg2rad(lat));
  const cosLng = Math.cos(deg2rad(lng));
  const sinLng = Math.sin(deg2rad(lng));

  return `(${cosLat} * coslat + (${cosLng} * coslng + ${sinLng} * sinlng) + ${sinLat} * sinlat)`;
};
