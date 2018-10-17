import { createStackNavigator } from 'react-navigation';

// Screens
import HomeScreen from './HomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

// Config
import * as COLORS from '../../config/colors';

export default createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    'Sign In': {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: 'Sign In',
      }),
    },
    'Sign Up': {
      screen: SignUpScreen,
      navigationOptions: () => ({
        title: 'Sign Up',
      }),
    },
    'Forgot Password': {
      screen: ForgotPasswordScreen,
      navigationOptions: () => ({
        title: 'Forgot Password',
      }),
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    },
    cardStyle: { backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR },
  },
);
