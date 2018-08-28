import PropTypes from 'prop-types';
import React from 'react';
import {
  View, TextInput, StyleSheet, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Input = ({
  onChangeText, value, placeholder, secureTextEntry, style,
}) => (
  <View>
    <TextInput
      placeholder={placeholder}
      returnKeyType="done"
      underlineColorAndroid="transparent"
      style={[styles.inputStyle, style]}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      autoCapitalize="none"
    />
  </View>
);

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: 'white',
    marginVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: width * 0.8,
  },
});

export default Input;

Input.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  style: PropTypes.shape(),
};

Input.defaultProps = {
  value: null,
  secureTextEntry: false,
  style: {},
};
