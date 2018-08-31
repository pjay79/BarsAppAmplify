import PropTypes from 'prop-types';
import React from 'react';
import { Popup } from 'react-native-map-link';

const MapLinks = ({
  isVisible,
  onCancelPressed,
  onAppPressed,
  onBackButtonPressed,
  name,
  lat,
  lng,
  id,
}) => (
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
      googlePlaceId: id,
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

MapLinks.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancelPressed: PropTypes.func.isRequired,
  onAppPressed: PropTypes.func.isRequired,
  onBackButtonPressed: PropTypes.func.isRequired,
  name: PropTypes.string,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

MapLinks.defaultProps = {
  name: '',
};

export default MapLinks;
