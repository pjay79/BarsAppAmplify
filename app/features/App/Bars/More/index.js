import PropTypes from 'prop-types';
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MoreScreen from './MoreScreen';

const MoreIcon = ({ tintColor }) => (
  <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={20} color={tintColor} />
);

MoreIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

// eslint-disable-next-line import/prefer-default-export
export const MoreStack = createStackNavigator(
  {
    More: {
      screen: MoreScreen,
    },
  },
  {
    navigationOptions: {
      tabBarIcon: MoreIcon,
    },
  },
);

MoreStack.navigationOptions = {
  tabBarIcon: MoreIcon,
};
