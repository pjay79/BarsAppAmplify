import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Config from 'react-native-config';
import axios from 'axios';
import * as COLORS from '../config/colors';

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    bars: [],
    latitude: '',
    longitude: '',
  };

  componentDidMount() {
    this.getNearbyBars();
  }

  getNearbyBars = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          () => {
            this.searchBars();
          },
        );
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  searchBars = async () => {
    try {
      const { latitude, longitude } = this.state;

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&rankBy=distance&type=bar&key=${
        Config.GOOGLE_PLACES_API_KEY
      }`;

      const response = await axios.get(url);
      this.setState({
        bars: response.data.results,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { latitude, longitude, bars } = this.state;

    if (!latitude || !longitude) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Dark}
          zoomLevel={13}
          centerCoordinate={[longitude, latitude]}
          style={styles.container}
          showUserLocation
        >
          {bars.map(data => (
            <Mapbox.PointAnnotation
              key={data.place_id}
              id={data.id}
              coordinate={[data.geometry.location.lng, data.geometry.location.lat]}
            >
              <View style={styles.annotationContainer}>
                <View style={styles.annotationFill} />
              </View>
              <Mapbox.Callout title={data.name} />
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_TEXT_COLOR,
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
