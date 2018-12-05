// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Auth } from 'aws-amplify';
import Geolocation from 'react-native-geolocation-service';
import SplashScreen from 'react-native-splash-screen';

// Components
import ListItem from './components/ListItem';

// Services
import nearbyPlacesSearch from '../../../../services/nearbyPlacesSearch';

// Config
import * as COLORS from '../../../../config/colors';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

type State = {
  bars: Array<{
    id: string,
    name: string,
    price_level: number,
    opening_hours: { open_now: boolean },
    geometry: { location: { lat: string, lng: string } },
  }>,
  latitude: string,
  longitude: string,
  pageToken: string,
  refreshing: boolean,
};

export default class ListScreen extends PureComponent<Props, State> {
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
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
        },
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

  renderSeparator = () => <View style={styles.separator} />;

  renderItem = ({
    item,
  }: {
    item: {
      id: string,
      name: string,
      price_level: number,
      opening_hours: { open_now: boolean },
      geometry: { location: { lat: string, lng: string } },
    },
  }) => {
    const { navigation } = this.props;
    const { latitude, longitude } = this.state;

    return (
      <ListItem item={item} navigation={navigation} latitude={latitude} longitude={longitude} />
    );
  };

  getItemLayout = (
    data: ?Array<{
      id: string,
      name: string,
      price_level: number,
      opening_hours: { open_now: boolean },
      geometry: { location: { lat: string, lng: string } },
    }>,
    index: number,
  ) => ({ length: 60, offset: 60 * index, index });

  keyExtractor = (item: { id: string }) => item.id;

  render() {
    const { bars, refreshing } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.refreshWrapper}>
          <Text style={styles.refreshLabel}>PULL TO REFRESH</Text>
        </View>
        <FlatList
          data={bars}
          getItemLayout={this.getItemLayout}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          initialNumToRender={20}
          windowSize={21}
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
  refreshWrapper: {
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshLabel: {
    fontSize: 8,
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  separator: {
    backgroundColor: COLORS.DIVIDER_COLOR,
    height: StyleSheet.hairlineWidth,
  },
  footer: {
    paddingVertical: 20,
  },
});
