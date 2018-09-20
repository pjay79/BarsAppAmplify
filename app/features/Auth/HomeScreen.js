import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// Components
import Button from '../../components/Button';

// Config
import * as COLORS from '../../config/colors';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.setItem('@SKIP_INTRO', 'true');
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bar Finder</Text>
          <Text style={styles.subtitle}>
            Powered by
            {'\n'}
            GOOGLE Places API
          </Text>
        </View>
        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/images/bars-logo.png')} style={styles.image} />
          <Text style={styles.imageSlogan}>
            Because no great story ever
            {' '}
            {'\n'}
            {' '}
            started with a salad.
          </Text>
        </View>
        <View>
          <Button
            title="SIGN IN"
            onPress={() => navigation.navigate('Sign In')}
            style={{ backgroundColor: COLORS.LIGHT_PRIMARY_COLOR, marginBottom: 10 }}
            textStyle={{ color: COLORS.TEXT_PRIMARY_COLOR }}
          />
          <Button
            title="SIGN UP"
            onPress={() => navigation.navigate('Sign Up')}
            style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={() => console.log('Go to ForgotPasswordScreen')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 44,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: '900',
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 30,
  },
  imageSlogan: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
  },
  forgotPassword: {
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
