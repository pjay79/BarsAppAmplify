// @flow
import { Linking } from 'react-native';

export default (phone: string) => {
  try {
    Linking.openURL(`tel://${phone}`);
    console.log(phone);
  } catch (error) {
    console.log(error);
  }
};
