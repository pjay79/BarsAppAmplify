// @flow
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Config
import * as COLORS from '../../config/colors';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

const slides = [
  {
    key: '1',
    title: 'Find neary bars',
    text: 'Based on your current location',
    image: require('../../assets/images/bar.png'),
    imageStyle: { resizeMode: 'contain', height: 180, width: 180 },
    titleStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 30, fontWeight: '400' },
    textStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 18 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  {
    key: '2',
    title: 'View details',
    text: 'Price level, ratings, and reviews',
    image: require('../../assets/images/rating.png'),
    imageStyle: { resizeMode: 'contain', height: 180, width: 180 },
    titleStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 30, fontWeight: '400' },
    textStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 18 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  {
    key: '3',
    title: 'Get directions',
    text: 'In Maps, Uber, Waze, and more...',
    image: require('../../assets/images/location.png'),
    imageStyle: { resizeMode: 'contain', height: 180, width: 180 },
    titleStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 30, fontWeight: '400' },
    textStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 18 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  {
    key: '4',
    title: 'Add favourites',
    text: 'Save the best places',
    image: require('../../assets/images/favourite.png'),
    imageStyle: { resizeMode: 'contain', height: 180, width: 180 },
    titleStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 30, fontWeight: '400' },
    textStyle: { color: COLORS.TEXT_PRIMARY_COLOR, fontSize: 18 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
];

export default class IntroScreen extends PureComponent<Props> {
  componentDidMount() {
    SplashScreen.hide();
  }

  skipIntro = () => {
    const { navigation } = this.props;
    navigation.navigate('Auth');
  };

  renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-arrow-round-forward"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={styles.icon}
      />
    </View>
  );

  renderDoneButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} style={styles.icon} />
    </View>
  );

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        showSkipButton
        onSkip={this.skipIntro}
        onDone={this.skipIntro}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
      />
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
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'transparent',
  },
});
