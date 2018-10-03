import { Animated, Easing } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export const fadeInAnimation = (value, duration = 100) => Animated.timing(value, {
  toValue: 1,
  duration,
  easing: Easing.easein,
  useNativeDriver: true,
});
