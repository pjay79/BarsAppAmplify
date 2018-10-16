// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  AsyncStorage,
  Animated,
} from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

// Components
import Button from '../../components/Button';

// Config
import * as COLORS from '../../config/colors';
import { fadeInAnimation } from '../../config/animations';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

export default class HomeScreen extends PureComponent<Props> {
  static navigationOptions = {
    header: null,
  };

  animatedValue1 = new Animated.Value(0);

  animatedValue2 = new Animated.Value(0);

  animatedValue3 = new Animated.Value(0);

  animatedValue4 = new Animated.Value(0);

  animatedHeaderStyle = {
    opacity: this.animatedValue1,
    transform: [
      {
        translateY: this.animatedValue1.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  animatedImageStyle = {
    opacity: this.animatedValue2,
    transform: [
      {
        scale: this.animatedValue2,
      },
    ],
  };

  animatedImageSloganStyle = {
    transform: [
      {
        scale: this.animatedValue3,
      },
      {
        translateY: this.animatedValue3.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  animatedButtonGroupStyle = {
    opacity: this.animatedValue4,
  };

  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.setItem('@SKIP_INTRO', 'true');
    this.animateSections();
  }

  animateSections = () => {
    Animated.sequence([
      fadeInAnimation(this.animatedValue1, 300),
      fadeInAnimation(this.animatedValue2),
      fadeInAnimation(this.animatedValue3),
      fadeInAnimation(this.animatedValue4),
    ]).start();
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, this.animatedHeaderStyle]}>
          <Text style={styles.title}>Bar Search</Text>
          <Text style={styles.subtitle}>
            Powered by
            {'\n'}
            GOOGLE Places API
          </Text>
        </Animated.View>
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={require('../../assets/images/bars-logo.png')}
            style={[styles.image, this.animatedImageStyle]}
          />
          <Animated.Text style={[styles.imageSlogan, this.animatedImageSloganStyle]}>
            Because no great story ever
            {' '}
            {'\n'}
            {' '}
started with a salad.
          </Animated.Text>
        </View>
        <Animated.View style={this.animatedButtonGroupStyle}>
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
          <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
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
    fontFamily: 'Quantify',
    fontSize: 64,
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
