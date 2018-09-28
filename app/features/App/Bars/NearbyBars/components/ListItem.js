import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing,
} from 'react-native';

// Util
import displayPriceRating from '../../../../../util/displayPriceRating';
import calculateDistance from '../../../../../util/calculateDistance';

// Config
import * as COLORS from '../../../../../config/colors';

export default class ListItem extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.shape().isRequired,
    index: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  };

  animatedValue = new Animated.Value(0);

  componentDidMount() {
    this.animateListItem();
  }

  animateListItem = () => {
    const { index } = this.props;
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 150,
      delay: index * 20,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const {
      item, navigation, latitude, longitude,
    } = this.props;

    return (
      <Animated.View style={[styles.card, { opacity: this.animatedValue }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Details', { bar: item })}>
          <View style={styles.cardUpper}>
            <Text style={styles.header}>{item.name}</Text>
            <Text
              style={
                item.opening_hours && item.opening_hours.open_now
                  ? styles.openText
                  : styles.closeText
              }
            >
              {item.opening_hours && item.opening_hours.open_now ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
          <View style={styles.cardLower}>
            {displayPriceRating(item.price_level)}
            <Text style={styles.distance}>
              {calculateDistance(
                latitude,
                longitude,
                item.geometry.location.lat,
                item.geometry.location.lng,
              )}
              m
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    height: 60,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardUpper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
  },
  openText: {
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.ACCENT_COLOR,
  },
  closeText: {
    fontWeight: '600',
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  cardLower: {
    flexDirection: 'row',
    letterSpacing: 2,
    justifyContent: 'space-between',
  },
  distance: {
    color: COLORS.DARK_PRIMARY_COLOR,
  },
});
