import React from 'react';
import renderer from 'react-test-renderer';
import Guidelines from '../Guidelines';

test('Button renders correctly', () => {
  const tree = renderer.create(<Guidelines />).toJSON();
  expect(tree).toMatchSnapshot();
});
