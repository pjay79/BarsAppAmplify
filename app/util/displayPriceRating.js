// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';

// Config
import * as COLORS from '../config/colors';

export default (price: number) => {
  if (!price) {
    return <Text style={styles.priceEmpty}>NO PRICE INFO</Text>;
  }
  if (price === 0) {
    return (
      <View style={styles.price}>
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
      </View>
    );
  }
  if (price === 1) {
    return (
      <View style={styles.price}>
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
      </View>
    );
  }
  if (price === 2) {
    return (
      <View style={styles.price}>
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
      </View>
    );
  }
  if (price === 3) {
    return (
      <View style={styles.price}>
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
      </View>
    );
  }
  if (price === 4) {
    return (
      <View style={styles.price}>
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  price: {
    flexDirection: 'row',
  },
  priceEmpty: {
    fontSize: 12,
  },
});
