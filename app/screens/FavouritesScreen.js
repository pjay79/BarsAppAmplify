import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import UserBarsList from '../components/UserBarsList';

export default class FavouritesScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    id: '',
    user: '',
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    const id = currentUser.signInUserSession.accessToken.payload.sub;
    const user = currentUser.signInUserSession.accessToken.payload.username;
    this.setState({ id, user });
    console.log(id, user);
  };

  render() {
    const { id, user } = this.state;

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
  card: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
