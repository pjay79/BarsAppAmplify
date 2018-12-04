// @flow
import React from 'react';
import { Popup } from 'react-native-map-link';

// Types
type Props = {
  isVisible: boolean,
  onCancelPressed: Function,
  onAppPressed: Function,
  onBackButtonPressed: Function,
  name: string,
  lat: number,
  lng: number,
  barId: string,
};

const MapLinks = ({
  isVisible,
  onCancelPressed,
  onAppPressed,
  onBackButtonPressed,
  name,
  lat,
  lng,
  barId,
}: Props) => (
  <Popup
    isVisible={isVisible}
    onCancelPressed={onCancelPressed}
    onAppPressed={onAppPressed}
    onBackButtonPressed={onBackButtonPressed}
    modalProps={{
      // you can put all react-native-modal props inside.
      animationIn: 'slideInUp',
    }}
    appsWhiteList={[
      'apple-maps',
      'google-maps',
      'uber',
      'waze',
      'lyft',
      'transit',
      'yandex',
      'moovit',
      'citymapper',
    ]}
    options={{
      /* See `showLocation` method above, this accepts the same options. */
      title: name,
      latitude: lat,
      longitude: lng,
      googleForceLatLon: true,
      googlePlaceId: barId,
      dialogTitle: 'Directions',
      dialogMessage: 'Open bar location in one of the following apps:',
      cancelText: 'Cancel',
    }}
    style={
      {
        /* Optional: you can override default style by passing your values. */
      }
    }
  />
);

export default MapLinks;
