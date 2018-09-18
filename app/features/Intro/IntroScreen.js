import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../../config/colors';

const slides = [
  {
    key: '1',
    title: 'Find nearby bars',
    text: 'Add to favourites...',
    image: require('../../assets/images/bar.png'),
    imageStyle: { height: 180, width: 180 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  {
    key: '2',
    title: 'Get directions',
    text: 'And start bar hopping!',
    image: require('../../assets/images/jumping-dancer.png'),
    imageStyle: { height: 180, width: 180 },
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
];

export default class IntroScreen extends Component {
  static navigationOptions = {
    header: null,
  };

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

IntroScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
