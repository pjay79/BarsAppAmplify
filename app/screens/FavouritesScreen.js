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
    user: '',
    loading: false,
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    this.setState({ loading: true });
    const currentUser = await Auth.currentAuthenticatedUser();
    const id = currentUser.signInUserSession.accessToken.payload.sub;
    const user = currentUser.signInUserSession.accessToken.payload.username;
    this.setState({ id, user, loading: false });
    console.log(id, user);
  };

  render() {
    const { id, user, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <UserBarsList id={id} user={user} />
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
