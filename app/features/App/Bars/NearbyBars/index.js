import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListScreen from './ListScreen';
import ListItemDetailsScreen from './ListItemDetailsScreen';
import MapScreen from './MapScreen';

// Config
import * as COLORS from '../../../../config/colors';

const ListStack = createStackNavigator(
  {
    List: {
      screen: ListScreen,
    },
    Details: {
      screen: ListItemDetailsScreen,
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
export const NearbyTabStack = createStackNavigator(
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
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Ionicons name={Platform.OS === 'ios' ? 'ios-beer' : 'md-beer'} size={20} color={tintColor} />
  ),
};
