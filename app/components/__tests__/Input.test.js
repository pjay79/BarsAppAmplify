import React from 'react';
import renderer from 'react-test-renderer';
import Input from '../Input';

test('Input renders correctly', () => {
  const onChangeText = jest.fn();
  const tree = renderer
    .create(<Input placeholder="test@test.com" onChangeText={onChangeText} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
