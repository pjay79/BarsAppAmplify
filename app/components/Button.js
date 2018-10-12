// @flow
import React from 'react';
import {
  TouchableOpacity, View, Text, Dimensions, StyleSheet,
} from 'react-native';

// Types
type Props = {
  title: string,
  onPress: Function,
  style: {},
  textStyle?: {},
};

const Button = ({
  title, onPress, style, textStyle,
}: Props) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.buttonContainer, style]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'grey',
    marginBottom: 5,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    width: width * 0.8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 2,
  },
});

Button.defaultProps = {
  textStyle: {},
};

export default Button;
