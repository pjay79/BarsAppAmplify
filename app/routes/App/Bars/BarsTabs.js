import { createBottomTabNavigator } from 'react-navigation';

import { NearbyTabStack } from './NearbyBars/NearbyStack';
import { FavouritesTabStack } from './Favourites/FavouritesStack';
import { MoreStack } from './More/MoreStack';

import * as COLORS from '../../../config/colors';

export default createBottomTabNavigator(
  {
    'Nearby Bars': {
      screen: NearbyTabStack,
    },
    Favourites: {
      screen: FavouritesTabStack,
    },
    More: {
      screen: MoreStack,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: COLORS.TEXT_PRIMARY_COLOR,
      inactiveTintColor: COLORS.LIGHT_PRIMARY_COLOR,
      style: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      },
    },
  },
);
