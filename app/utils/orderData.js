// @flow
import _ from 'lodash';

export default (array: Array<{ name: string }>, property: string, direction: string) => {
  const result = _.orderBy(array, [property], [direction]);
  return result;
};
