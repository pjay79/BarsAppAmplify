import PropTypes from 'prop-types';
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

// Util
import displayPriceRating from '../util/displayPriceRating';
import calculateDistance from '../util/calculateDistance';

// Config
import * as COLORS from '../config/colors';

const ListItem = ({
  item, navigation, latitude, longitude,
}) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={() => navigation.navigate('Details', { bar: item })}>
      <View style={styles.cardUpper}>
        <Text style={styles.header}>{item.name}</Text>
        <Text
          style={
            item.opening_hours && item.opening_hours.open_now ? styles.openText : styles.closeText
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
  </View>
);

const styles = StyleSheet.create({
  card: {
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

ListItem.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  item: PropTypes.shape().isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default ListItem;
