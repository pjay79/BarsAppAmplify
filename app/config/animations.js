import { Animated, Easing } from 'react-native';

export const fadeInAnimation = (value, duration = 100) => Animated.timing(value, {
  toValue: 1,
  duration,
  easing: Easing.ease,
  useNativeDriver: true,
});

export const itemAnimation = (value, duration = 125) => Animated.timing(value, {
  toValue: 1,
  duration,
  easing: Easing.linear,
  useNativeDriver: true,
});
