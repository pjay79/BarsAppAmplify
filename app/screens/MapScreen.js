import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Config from 'react-native-config';

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={15}
          centerCoordinate={[11.256, 43.77]}
          style={styles.container}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
