import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AllBarsScreen from './AllBarsScreen';
import UserBarsScreen from './UserBarsScreen';

// Config
import * as COLORS from '../../../../config/colors';

const UserBarsStack = createStackNavigator(
  {
    User: {
      screen: UserBarsScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    inititalRouteName: 'User',
  },
);

const AllBarsStack = createStackNavigator(
  {
    All: {
      screen: AllBarsScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    inititalRouteName: 'All',
  },
);

const FavouritesTabs = createMaterialTopTabNavigator(
  {
    All: {
      screen: AllBarsStack,
    },
    Me: {
      screen: UserBarsStack,
    },
  },
  {
    swipeEnabled: false,
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

// eslint-disable-next-line import/prefer-default-export
export const FavouritesTabStack = createStackNavigator(
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
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Ionicons name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} size={25} color={tintColor} />
  ),
};
