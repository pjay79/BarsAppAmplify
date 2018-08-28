import PropTypes from 'prop-types';
import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../config/colors';

// Screens
import LoadingScreen from '../screens/LoadingScreen';
import IntroScreen from '../screens/IntroScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BarsScreen from '../screens/BarsScreen';
import BarDetailsScreen from '../screens/BarDetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MoreScreen from '../screens/MoreScreen';

const BarsIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-beer' : 'md-beer'} size={20} color={tintColor} />
);

const FavouritesIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} size={25} color={tintColor} />
);

const MoreIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={20} color={tintColor} />
);

const BarsStack = createStackNavigator(
  {
    Bars: {
      screen: BarsScreen,
    },
    Details: {
      screen: BarDetailsScreen,
    },
  },
  {
    inititalRouteName: 'Bars',
  },
);

BarsStack.navigationOptions = {
  tabBarIcon: BarsIcon,
};

const FavouritesStack = createStackNavigator(
  {
    Favourites: {
      screen: FavouritesScreen,
    },
  },
  {
    inititalRouteName: 'Favourites',
  },
);

const CommunityStack = createStackNavigator(
  {
    Community: {
      screen: CommunityScreen,
    },
  },
  {
    inititalRouteName: 'Community',
  },
);

const FavouritesTabs = createMaterialTopTabNavigator(
  {
    All: {
      screen: CommunityStack,
    },
    Me: {
      screen: FavouritesStack,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: COLORS.TEXT_PRIMARY_COLOR,
      inactiveTintColor: COLORS.LIGHT_PRIMARY_COLOR,
      indicatorStyle: {
        backgroundColor: COLORS.ACCENT_COLOR,
      },
      style: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      },
    },
  },
);

const FavouritesTabStack = createStackNavigator(
  {
    FavouritesTabs: {
      screen: FavouritesTabs,
    },
  },
  {
    navigationOptions: {
      headerTitle: 'Favourites',
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
        borderBottomColor: COLORS.LIGHT_PRIMARY_COLOR,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    },
  },
);

FavouritesTabStack.navigationOptions = {
  tabBarIcon: FavouritesIcon,
};

const MoreStack = createStackNavigator(
  {
    More: {
      screen: MoreScreen,
    },
  },
  {
    inititalRouteName: 'More',
  },
);

MoreStack.navigationOptions = {
  tabBarIcon: MoreIcon,
};

const BarsTabs = createBottomTabNavigator(
  {
    'Nearby Bars': {
      screen: BarsStack,
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

const AuthStack = createStackNavigator({
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

const AppStack = createStackNavigator(
  {
    BarsTabs: {
      screen: BarsTabs,
    },
  },
  {
    headerMode: 'none',
  },
);

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

BarsIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

FavouritesIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

MoreIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
