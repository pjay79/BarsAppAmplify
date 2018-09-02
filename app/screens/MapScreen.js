import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
// import MapView from 'react-native-maps';

export default class MapScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <MapView
          style={styles.map}
          initialRegion={{
            // initial region set to Bileto
            latitude: 50.0517273,
            longitude: 14.4286503,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
