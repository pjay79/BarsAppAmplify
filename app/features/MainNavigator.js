import { createSwitchNavigator } from 'react-navigation';

// Screens
import LoadingScreen from './Loading/LoadingScreen';
import IntroScreen from './Intro/IntroScreen';
import AuthStack from './Auth';
import AppStack from './App';

export default createSwitchNavigator(
  {
    Loading: {
      screen: LoadingScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Intro: {
      screen: IntroScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Loading',
  },
);
