import React from 'react';
import { shallow } from 'enzyme';
import AllBarsListItem from '../AllBarsListItem';

describe('AllBarsListItem', () => {
  it('Renders correctly', () => {
    Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf());
    const wrapper = shallow(
      <AllBarsListItem
        item={{ id: '123' }}
        addToUserFavourites={() => console.log('Add Favourite')}
        openWebsiteLink={() => console.log('Open Website')}
        toggleMapLinks={() => console.log('Open MapLinks')}
        openPhone={() => console.log('Open Phone')}
        isVisible
        adding={false}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
