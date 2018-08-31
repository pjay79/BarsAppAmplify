import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Auth } from 'aws-amplify';
import UserBarsList from '../components/UserBarsList';
import * as COLORS from '../config/colors';

export default class FavouritesScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    id: '',
    loading: false,
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      this.setState({ loading: true });
      const currentUser = await Auth.currentAuthenticatedUser();
      const id = currentUser.signInUserSession.accessToken.payload.sub;
      this.setState({ id, loading: false });
      console.log(id);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  render() {
    const { id, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <UserBarsList id={id} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
