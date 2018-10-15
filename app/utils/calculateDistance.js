// @flow
import geolib from 'geolib';

export default (userLat: string, userLng: string, barLat: string, barLng: string) => {
  const startCoords = {
    latitude: userLat,
    longitude: userLng,
  };
  const barCoords = {
    latitude: barLat,
    longitude: barLng,
  };
  const distance = geolib.getDistance(startCoords, barCoords);
  // console.log(distance);
  return distance;
};
