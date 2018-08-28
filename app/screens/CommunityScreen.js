import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AllBarsList from '../components/AllBarsList';

export default class CommunityScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <AllBarsList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  card: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
