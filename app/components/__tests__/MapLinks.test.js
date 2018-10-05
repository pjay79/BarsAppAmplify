import React from 'react';
import renderer from 'react-test-renderer';
import MapLinks from '../MapLinks';

test('MapLinks renders correctly', () => {
  const tree = renderer
    .create(
      <MapLinks
        isVisible
        onCancelPressed={() => console.log('Cancel pressed.')}
        onAppPressed={() => console.log('App pressed.')}
        onBackButtonPressed={() => console.log('Back button pressed.')}
        name="Credo"
        lat={123123123}
        lng={444444444}
        barId="123456789"
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
