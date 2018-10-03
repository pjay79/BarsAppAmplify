import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  AsyncStorage,
  Animated,
  Easing,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// Components
import Button from '../../components/Button';

// Config
import * as COLORS from '../../config/colors';

export default class HomeScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

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

  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.setItem('@SKIP_INTRO', 'true');
    this.animateSections();
  }

  fadeInAnimation = (value, duration = 100) => Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.easein,
    useNativeDriver: true,
  });

  animateSections = () => {
    Animated.sequence([
      this.fadeInAnimation(this.animatedValue1, 300),
      this.fadeInAnimation(this.animatedValue2),
      this.fadeInAnimation(this.animatedValue3),
      this.fadeInAnimation(this.animatedValue4),
    ]).start();
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, this.animatedHeaderStyle]}>
          <Text style={styles.title}>Bar Finder</Text>
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
        <Animated.View style={{ opacity: this.animatedValue4 }}>
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
