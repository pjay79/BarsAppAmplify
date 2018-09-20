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

// Services
import nearbyPlacesSearch from '../../../../services/nearbyPlacesSearch';

// Util
import displayPriceRating from '../../../../util/displayPriceRating';
import calculateDistance from '../../../../util/calculateDistance';

// Config
import * as COLORS from '../../../../config/colors';

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
      const response = await nearbyPlacesSearch(latitude, longitude, pageToken);
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

  renderFooter = () => {
    const { pageToken } = this.state;
    if (pageToken === undefined) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />
      </View>
    );
  };

  renderSeparator = () => (
    <View style={styles.separator} />
  );

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    const { latitude, longitude } = this.state;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('Details', { bar: item })}>
          <View style={styles.cardUpper}>
            <Text style={styles.header}>
              {item.name}
            </Text>
            <Text style={
              item.opening_hours
              && item.opening_hours.open_now ? styles.openText : styles.closeText}
            >
              {item.opening_hours && item.opening_hours.open_now ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
          <View style={styles.cardLower}>
            {displayPriceRating(item.price_level)}
            <Text style={styles.distance}>
              {calculateDistance(
                latitude,
                longitude,
                item.geometry.location.lat,
                item.geometry.location.lng,
              )}
              m
            </Text>
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
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
  },
  card: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardUpper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  openText: {
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.ACCENT_COLOR,
  },
  closeText: {
    fontWeight: '600',
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  cardLower: {
    flexDirection: 'row',
    letterSpacing: 2,
    justifyContent: 'space-between',
  },
  distance: {
    color: COLORS.DARK_PRIMARY_COLOR,
  },
  separator: {
    backgroundColor: COLORS.DIVIDER_COLOR,
    height: StyleSheet.hairlineWidth,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 20,
  },
  dollar: {
    flexDirection: 'row',
  },
  noDollar: {
    fontSize: 12,
  },
});

ListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
