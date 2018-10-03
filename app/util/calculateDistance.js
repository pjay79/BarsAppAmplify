// @flow
import geolib from 'geolib';

export default (userLat: number, userLng: number, barLat: number, barLng: number) => {
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
