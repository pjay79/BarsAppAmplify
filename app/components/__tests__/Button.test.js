import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

test('Button renders correctly', () => {
  const onPress = jest.fn();
  const tree = renderer.create(<Button title="Submit" onPress={onPress} />).toJSON();
  expect(tree).toMatchSnapshot();
});
