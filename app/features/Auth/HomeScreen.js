// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  AsyncStorage,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Auth } from 'aws-amplify';
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

  state = {
    loading: false,
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

  unauthenticatedAccess = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      await Auth.signIn('Guest', 'Password1!');
      const credentials = await Auth.currentCredentials();
      console.log(credentials);
      this.setState({ loading: false });
      navigation.navigate('App');
    } catch (error) {
      console.log(error.message);
      this.setState({ loading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, this.animatedHeaderStyle]}>
          <Text style={styles.title}>Bar Search</Text>
          <Image source={require('../../assets/images/powered_by_google_on_non_white.png')} />
        </Animated.View>
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={require('../../assets/images/barsappamplify.png')}
            style={[styles.image, this.animatedImageStyle]}
          />
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
          <View style={styles.textLinksWrapper}>
            <TouchableOpacity onPress={this.unauthenticatedAccess}>
              <Text style={[styles.textLinks, { marginBottom: 5 }]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
              <Text style={styles.textLinks}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loadingWrapper}>
            {loading && <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />}
          </View>
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
    ...Platform.select({
      ios: { fontFamily: 'Quantify' },
      android: { fontFamily: 'Quantify Bold' },
    }),
    // fontFamily: Platform.ios ? 'Quantify' : 'Quantify Bold',
    fontSize: 64,
    marginBottom: 10,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    height: 225,
    width: 225,
  },
  imageSlogan: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
  },
  textLinksWrapper: {
    // justifyContent: 'space-evenly',
  },
  textLinks: {
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
  loadingWrapper: {
    marginTop: 10,
    height: 20,
  },
});
