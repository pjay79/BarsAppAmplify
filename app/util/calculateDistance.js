import geolib from 'geolib';

export default (userLat, userLng, barLat, barLng) => {
  const startCoords = {
    latitude: userLat,
    longitude: userLng,
  };
  const barCoords = {
    latitude: barLat,
    longitude: barLng,
  };
  const distance = geolib.getDistance(startCoords, barCoords);
  return distance;
};
