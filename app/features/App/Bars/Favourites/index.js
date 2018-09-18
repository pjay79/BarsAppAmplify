import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FavouritesScreen from './FavouritesScreen';
import CommunityScreen from './CommunityScreen';

import * as COLORS from '../../../../config/colors';

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
