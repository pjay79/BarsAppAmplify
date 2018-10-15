// @flow
export default (bar: {
  place_id: string,
  name: string,
  geometry: { location: { lng: string, lat: string } },
}) => {
  const shape = {
    type: 'Feature',
    properties: {
      id: bar.place_id,
      name: bar.name,
    },
    geometry: {
      coordinates: [bar.geometry.location.lng, bar.geometry.location.lat],
      type: 'Point',
    },
  };
  // console.log(shape);
  return shape;
};
