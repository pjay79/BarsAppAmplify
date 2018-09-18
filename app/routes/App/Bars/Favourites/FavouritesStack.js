import PropTypes from 'prop-types';
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FavouritesScreen from '../../../../screens/FavouritesScreen';
import CommunityScreen from '../../../../screens/CommunityScreen';

import * as COLORS from '../../../../config/colors';

const FavouritesIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} size={25} color={tintColor} />
);

FavouritesIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
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
      tabBarIcon: FavouritesIcon,
    },
  },
);

FavouritesTabStack.navigationOptions = {
  tabBarIcon: FavouritesIcon,
};
