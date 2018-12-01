import { createBottomTabNavigator } from 'react-navigation';

import { NearbyBarsStack } from './NearbyBars';
import { FavouritesTabStack } from './Favourites';
import { MoreStack } from './More';

// Config
import * as COLORS from '../../../config/colors';

export default createBottomTabNavigator(
  {
    'Nearby Bars': {
      screen: NearbyBarsStack,
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
