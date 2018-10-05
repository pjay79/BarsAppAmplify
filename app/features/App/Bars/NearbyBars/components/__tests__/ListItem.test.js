import React from 'react';
import { shallow } from 'enzyme';
import ListItem from '../ListItem';

describe('UserBarsListItem', () => {
  it('Renders correctly', () => {
    const navigation = { navigate: jest.fn() };
    const wrapper = shallow(
      <ListItem item={{ geometry: { location: { lat: '-123', lng: '-44' } } }} navigation={navigation} latitude={-123} longitude={40} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
