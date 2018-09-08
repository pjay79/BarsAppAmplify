import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import * as COLORS from '../config/colors';

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    bars: [],
    latitude: '',
    longitude: '',
    pageToken: '',
    activeModal: null,
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
      const {
        bars, latitude, longitude, pageToken,
      } = this.state;

      const urlFirst = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&rankBy=distance&type=bar&key=${
        Config.GOOGLE_PLACES_API_KEY
      }`;

      const urlNext = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&rankBy=distance&type=bar&key=${
        Config.GOOGLE_PLACES_API_KEY
      }&pagetoken=${pageToken}`;

      const url = pageToken === '' ? urlFirst : urlNext;
      const response = await axios.get(url);
      const arrayData = [...bars, ...response.data.results];
      this.setState({
        bars: pageToken === '' ? response.data.results : arrayData,
        pageToken: response.data.next_page_token,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  geoJSON = (bar) => {
    const shape = {
      type: 'Feature',
      properties: {
        name: bar.name,
      },
      geometry: {
        coordinates: [bar.geometry.location.lng, bar.geometry.location.lat],
        type: 'Point',
      },
    };
    console.log(shape);
    return shape;
  };

  openModal = (e) => {
    const feature = e.nativeEvent.payload;
    console.log('You pressed a layer here is your feature', feature);
    this.setState({ activeModal: feature.properties.name });
  }

  hideModal = () => {
    this.setState({ activeModal: null });
  }

  render() {
    const {
      latitude,
      longitude,
      bars,
      activeModal,
    } = this.state;

    if (!latitude || !longitude) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Dark}
          zoomLevel={13}
          centerCoordinate={[longitude, latitude]}
          style={styles.container}
          showUserLocation
          logoEnabled={false}
        >
          {bars.map(bar => (
            <View key={bar.place_id}>
              <MapboxGL.ShapeSource
                id={bar.place_id}
                shape={this.geoJSON(bar)}
                onPress={this.openModal}
              >
                <MapboxGL.CircleLayer id={bar.place_id} style={layerStyles.singlePoint} />
              </MapboxGL.ShapeSource>
              <Modal id={bar.place_id} isVisible={activeModal === bar.name} backdropOpacity={0.8} onSwipe={this.hideModal} swipeDirection="down">
                <View style={styles.modalContainer}>
                  <Text style={styles.modalHeader}>
                    {bar.name}
                  </Text>
                  <TouchableOpacity onPress={this.hideModal}>
                    <Ionicons name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'} size={20} color={COLORS.ACCENT_COLOR} />
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          ))}
        </MapboxGL.MapView>
        <Button
          title="Load more"
          onPress={this.searchBars}
          style={{
            backgroundColor: COLORS.ACCENT_COLOR,
            marginBottom: 0,
            borderRadius: 0,
            width: '100%',
          }}
        />
      </View>
    );
  }
}

const layerStyles = MapboxGL.StyleSheet.create({
  singlePoint: {
    circleColor: COLORS.ACCENT_COLOR,
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
  },
});

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSubHeader: {
    color: COLORS.ACCENT_COLOR,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
});
