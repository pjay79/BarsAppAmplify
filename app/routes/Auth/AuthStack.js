import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../../screens/HomeScreen';
import SignInScreen from '../../screens/SignInScreen';
import SignUpScreen from '../../screens/SignUpScreen';

export default createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  'Sign In': {
    screen: SignInScreen,
  },
  'Sign Up': {
    screen: SignUpScreen,
  },
});
