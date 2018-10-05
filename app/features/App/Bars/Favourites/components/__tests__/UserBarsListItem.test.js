import React from 'react';
import { shallow } from 'enzyme';
import UserBarsListItem from '../UserBarsListItem';

describe('UserBarsListItem', () => {
  it('Renders correctly', () => {
    Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf());
    const wrapper = shallow(
      <UserBarsListItem
        item={{ id: '123' }}
        deleteFavourite={() => console.log('Delete Favourite')}
        openWebsiteLink={() => console.log('Open Website')}
        toggleMapLinks={() => console.log('Open MapLinks')}
        openPhone={() => console.log('Open Phone')}
        isVisible
        deleting={false}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
