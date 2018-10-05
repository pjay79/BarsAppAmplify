// @flow
import _ from 'lodash';

export default (array: Array<{}>, property: string, direction: string) => {
  const result = _.orderBy(array, [property], [direction]);
  return result;
};
