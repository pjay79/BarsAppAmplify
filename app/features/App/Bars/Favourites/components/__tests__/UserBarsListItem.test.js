import React from 'react';
import { shallow } from 'enzyme';
import UserBarsListItem from '../UserBarsListItem';

describe('UserBarsListItem', () => {
  it('Renders correctly', () => {
    Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf());
    const deleteFavourite = jest.fn();
    const openWebsiteLink = jest.fn();
    const toggleMapLinks = jest.fn();
    const openPhone = jest.fn();
    const wrapper = shallow(
      <UserBarsListItem
        item={{ id: '123' }}
        deleteFavourite={deleteFavourite}
        openWebsiteLink={openWebsiteLink}
        toggleMapLinks={toggleMapLinks}
        openPhone={openPhone}
        isVisible
        deleting={false}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
