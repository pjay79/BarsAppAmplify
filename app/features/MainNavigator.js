import { createSwitchNavigator } from 'react-navigation';
import LoadingScreen from './Loading/LoadingScreen';
import IntroScreen from './Intro/IntroScreen';
import AuthStack from './Auth';
import AppStack from './App';

export default createSwitchNavigator(
  {
    Loading: LoadingScreen,
    Intro: IntroScreen,
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Loading',
  },
);
