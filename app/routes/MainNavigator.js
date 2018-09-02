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
import ListScreen from '../screens/ListScreen';
import BarDetailsScreen from '../screens/BarDetailsScreen';
import MapScreen from '../screens/MapScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MoreScreen from '../screens/MoreScreen';

const NearbyIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-beer' : 'md-beer'} size={20} color={tintColor} />
);

const FavouritesIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} size={25} color={tintColor} />
);

const MoreIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={20} color={tintColor} />
);

const ListStack = createStackNavigator(
  {
    List: {
      screen: ListScreen,
    },
    Details: {
      screen: BarDetailsScreen,
    },
  },
  {
    inititalRouteName: 'List',
    headerMode: 'none',
  },
);

const MapStack = createStackNavigator(
  {
    Maps: {
      screen: MapScreen,
    },
  },
  {
    inititalRouteName: 'Map',
  },
);

const NearbyTabs = createMaterialTopTabNavigator(
  {
    List: {
      screen: ListStack,
    },
    Map: {
      screen: MapStack,
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

const NearbyTabStack = createStackNavigator(
  {
    NearybyTabs: {
      screen: NearbyTabs,
    },
  },
  {
    navigationOptions: {
      headerTitle: 'Nearby Bars',
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
        borderBottomColor: COLORS.LIGHT_PRIMARY_COLOR,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    },
  },
);

NearbyTabStack.navigationOptions = {
  tabBarIcon: NearbyIcon,
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

NearbyIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

FavouritesIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

MoreIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
