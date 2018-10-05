import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';

// Utils
import displayPriceRating from '../../../../../utils/displayPriceRating';
import calculateDistance from '../../../../../utils/calculateDistance';

// Config
import * as COLORS from '../../../../../config/colors';
import { itemAnimation } from '../../../../../config/animations';

export default class ListItem extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    item: PropTypes.shape().isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  };

  animatedValue = new Animated.Value(0);

  animatedItemStyle = {
    opacity: this.animatedValue,
    transform: [
      {
        translateY: this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  componentDidMount() {
    this.animateListItem();
  }

  animateListItem = () => {
    itemAnimation(this.animatedValue).start();
  };

  render() {
    const {
      item, navigation, latitude, longitude,
    } = this.props;

    return (
      <Animated.View style={[styles.card, this.animatedItemStyle]}>
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
