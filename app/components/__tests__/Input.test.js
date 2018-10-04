import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../Input';

test('renders correctly', () => {
  const tree = renderer
    .create(<Input placeholder="test@test.com" onChangeText={() => console.log('Text changed.')} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
