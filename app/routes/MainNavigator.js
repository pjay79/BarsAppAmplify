import { createSwitchNavigator } from 'react-navigation';
import LoadingScreen from './Loading/Loading';
import IntroScreen from './Intro/Intro';
import AuthStack from './Auth/AuthStack';
import AppStack from './App/AppStack';

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
