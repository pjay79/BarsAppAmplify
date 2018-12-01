import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListScreen from './ListScreen';
import ListItemDetailsScreen from './ListItemDetailsScreen';

// Config
import * as COLORS from '../../../../config/colors';

// eslint-disable-next-line import/prefer-default-export
export const NearbyBarsStack = createStackNavigator({
  List: {
    screen: ListScreen,
    navigationOptions: () => ({
      title: 'NearbyBars',
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    }),
  },
  Details: {
    screen: ListItemDetailsScreen,
    navigationOptions: () => ({
      title: 'Details',
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    }),
  },
});

NearbyBarsStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Ionicons name={Platform.OS === 'ios' ? 'ios-beer' : 'md-beer'} size={20} color={tintColor} />
  ),
};
