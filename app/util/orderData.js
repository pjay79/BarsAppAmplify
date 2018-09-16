import _ from 'lodash';

export default (array, property, direction) => {
  const result = _.orderBy(array, [property], [direction]);
  return result;
};
