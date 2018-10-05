import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

test('Button renders correctly', () => {
  const tree = renderer
    .create(<Button title="Submit" onPress={() => console.log('Button pressed.')} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
