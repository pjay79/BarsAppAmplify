import React from 'react';
import renderer from 'react-test-renderer';
import MapLinks from '../MapLinks';

test('MapLinks renders correctly', () => {
  const onCancelPressed = jest.fn();
  const onAppPressed = jest.fn();
  const onBackButtonPressed = jest.fn();
  const tree = renderer
    .create(
      <MapLinks
        isVisible
        onCancelPressed={onCancelPressed}
        onAppPressed={onAppPressed}
        onBackButtonPressed={onBackButtonPressed}
        name="Credo"
        lat={123123123}
        lng={444444444}
        barId="123456789"
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
