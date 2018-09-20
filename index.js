/** @format */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings([
  'Required dispatch_sync to load constants for MGLModule.',
  'RCTBridge required dispatch_sync to load MGLModule.',
  'RCTBridge required dispatch_sync to load RCTDevLoadingView',
]);

AppRegistry.registerComponent(appName, () => App);
