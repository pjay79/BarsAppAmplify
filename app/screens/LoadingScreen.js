import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, ActivityIndicator, StyleSheet, AsyncStorage,
} from 'react-native';
import { Auth } from 'aws-amplify';
import * as COLORS from '../config/colors';

export default class LoadingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.checkIntro();
  }

  checkIntro = async () => {
    try {
      const { navigation } = this.props;
      const value = await AsyncStorage.getItem('@SKIP_INTRO');
      if (value === 'true') {
        this.checkUser();
      } else {
        navigation.navigate('Intro');
      }
    } catch (error) {
      console.log(error);
    }
  };

  checkUser = async () => {
    try {
      const { navigation } = this.props;
      const user = await Auth.currentAuthenticatedUser();
      navigation.navigate(user ? 'App' : 'Auth');
      console.log('Cognito: ', user);
    } catch (error) {
      const { navigation } = this.props;
      navigation.navigate('Auth');
      console.log(error.message);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
});

LoadingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
