import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MoreScreen from './MoreScreen';

// eslint-disable-next-line import/prefer-default-export
export const MoreStack = createStackNavigator({
  More: {
    screen: MoreScreen,
  },
});

MoreStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={20} color={tintColor} />
  ),
};
