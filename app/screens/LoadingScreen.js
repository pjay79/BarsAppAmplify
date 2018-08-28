import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, ActivityIndicator, StyleSheet, AsyncStorage,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import * as COLORS from '../config/colors';

export default class LoadingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.checkIntro();
  }

  checkIntro = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('@SKIP_INTRO');
    if (value === 'true') {
      this.checkUser();
    } else {
      navigation.navigate('Intro');
    }
  };

  checkUser = async () => {
    const { navigation } = this.props;
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        navigation.navigate(user ? 'App' : 'Auth');
        console.log('Cognito: ', user);
      })
      .catch((error) => {
        navigation.navigate('Auth');
        console.log(error.message);
      });
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
