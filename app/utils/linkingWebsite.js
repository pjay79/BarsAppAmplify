// @flow
import { Linking } from 'react-native';

export default (website: string) => {
  try {
    const supported = Linking.canOpenURL(website);
    if (supported) {
      Linking.openURL(website);
      console.log(website);
    } else {
      console.log('Website url not valid.');
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
