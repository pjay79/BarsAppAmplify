import { createStackNavigator } from 'react-navigation';
import BarsTabs from './Bars/BarsTabs';

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
