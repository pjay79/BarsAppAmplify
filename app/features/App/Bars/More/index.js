import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import MoreScreen from './MoreScreen';

// Config
import * as COLORS from '../../../../config/colors';

// eslint-disable-next-line import/prefer-default-export
export const MoreStack = createStackNavigator({
  More: {
    screen: MoreScreen,
    navigationOptions: () => ({
      title: 'More',
      headerStyle: {
        backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      },
      headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
    }),
  },
});

MoreStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={20} color={tintColor} />
  ),
};
