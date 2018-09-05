import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Config from 'react-native-config';
import * as COLORS from '../config/colors';

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    latitude: '',
    longitude: '',
  };

  componentDidMount() {
    this.getUserLocation();
  }

  getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState(
          {
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          },
          () => {
            console.log('User location: ', this.state.latitude, this.state.longitude);
          },
        );
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  renderAnnotations = () => (
    <Mapbox.PointAnnotation key="pointAnnotation" id="pointAnnotation" coordinate={[11.256, 43.77]}>
      <View style={styles.annotationContainer}>
        <View style={styles.annotationFill} />
      </View>
      <Mapbox.Callout title="You are here" />
    </Mapbox.PointAnnotation>
  );

  render() {
    const { latitude, longitude } = this.state;

    return (
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Dark}
          zoomLevel={12}
          centerCoordinate={[-122.431, 37.774]}
          // centerCoordinate={[longitude, latitude]}
          style={styles.container}
          showUserLocation
        >
          {this.renderAnnotations()}
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.ACCENT_COLOR,
    transform: [{ scale: 0.6 }],
  },
});
