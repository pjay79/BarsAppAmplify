import React from 'react';
import { shallow } from 'enzyme';
import AllBarsListItem from '../AllBarsListItem';

describe('AllBarsListItem', () => {
  it('Renders correctly', () => {
    Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf());
    const addToUserFavourites = jest.fn();
    const openWebsiteLink = jest.fn();
    const toggleMapLinks = jest.fn();
    const openPhone = jest.fn();
    const wrapper = shallow(
      <AllBarsListItem
        item={{ id: '123' }}
        addToUserFavourites={addToUserFavourites}
        openWebsiteLink={openWebsiteLink}
        toggleMapLinks={toggleMapLinks}
        openPhone={openPhone}
        isVisible
        adding={false}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
