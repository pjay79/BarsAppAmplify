import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Auth } from 'aws-amplify';
import Geolocation from 'react-native-geolocation-service';
import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import geolib from 'geolib';
import Config from 'react-native-config';
import Foundation from 'react-native-vector-icons/Foundation';
import * as COLORS from '../config/colors';

export default class ListScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  mounted = false;

  state = {
    bars: [],
    latitude: '',
    longitude: '',
    pageToken: '',
    refreshing: false,
  };

  async componentDidMount() {
    SplashScreen.hide();
    this.mounted = true;
    this.getUser();
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getNearbyBars();
      } else {
        console.log('Permission denied');
      }
    } else {
      this.getNearbyBars();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getUser = async () => {
    try {
      const session = await Auth.currentSession();
      console.log(session);
    } catch (error) {
      console.log(error);
    }
  };

  getNearbyBars = () => {
    if (this.mounted) {
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
    }
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
        refreshing: false,
        pageToken: response.data.next_page_token,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        pageToken: '',
        refreshing: true,
      },
      () => {
        this.getNearbyBars();
      },
    );
  };

  handleLoadMore = () => {
    setTimeout(() => {
      this.getNearbyBars();
    }, 3000);
  };

  calculateDistance = (lat, lng) => {
    const { latitude, longitude } = this.state;
    const startCoords = {
      latitude,
      longitude,
    };
    const barCoords = {
      latitude: lat,
      longitude: lng,
    };
    const distance = geolib.getDistance(startCoords, barCoords);
    console.log(distance);
    return distance;
  }

  renderDollar = (price) => {
    if (price === 0) {
      return (
        <View style={styles.dollar}>
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        </View>
      );
    }
    if (price === 1) {
      return (
        <View style={styles.dollar}>
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        </View>
      );
    }
    if (price === 2) {
      return (
        <View style={styles.dollar}>
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        </View>
      );
    }
    if (price === 3) {
      return (
        <View style={styles.dollar}>
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        </View>
      );
    }
    if (price === 4) {
      return (
        <View style={styles.dollar}>
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
          <Foundation name="dollar" size={20} color={COLORS.SECONDARY_TEXT_COLOR} />
        </View>
      );
    }
    return null;
  }

  renderFooter = () => {
    const { pageToken } = this.state;
    if (pageToken === undefined) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />
      </View>
    );
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Details', { bar: item })}>
          <Text>
            {item.name}
          </Text>
          <Text>
            Rating:
            {item.rating}
          </Text>
          <Text>
            {item.opening_hours.open_now ? 'Open' : 'Closed'}
          </Text>
          <Text>
            {this.calculateDistance(item.geometry.location.lat, item.geometry.location.lng)}
            m
          </Text>
          <View>
            {this.renderDollar(item.price_level)}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { bars, refreshing } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={bars}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={10}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    paddingLeft: 20,
  },
  footer: {
    paddingVertical: 20,
  },
  dollar: {
    flexDirection: 'row',
  },
});

ListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
