import { createStackNavigator } from 'react-navigation';

import BarsTabs from './Bars';

export default createStackNavigator(
  {
    BarsTabs: {
      screen: BarsTabs,
    },
  },
  {
    headerMode: 'none',
  },
);
