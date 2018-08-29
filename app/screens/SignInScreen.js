import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import GetUser from '../graphql/queries/GetUser';
import CreateUser from '../graphql/mutations/CreateUser';
import Button from '../components/Button';
import Input from '../components/Input';
import * as COLORS from '../config/colors';

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  };

  state = {
    username: '',
    password: '',
    loading: false,
    error: '',
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  signIn = async () => {
    try {
      this.setState({ loading: true, error: '' });
      const { username, password } = this.state;
      const { navigation } = this.props;

      if (username && password) {
        await Auth.signIn(username, password);
        const currentUser = await Auth.currentAuthenticatedUser();
        const userId = currentUser.signInUserSession.accessToken.payload.sub;
        const user = currentUser.signInUserSession.accessToken.payload.username;
        console.log(currentUser);
        console.log(`id: ${userId} username: ${user}`);

        const authenticatedUser = await API.graphql(graphqlOperation(GetUser, { id: userId }));
        console.log(authenticatedUser);

        if (!authenticatedUser.data.getUser) {
          await API.graphql(graphqlOperation(CreateUser, { id: userId, username: user }));
        }

        navigation.navigate('App');
      } else {
        this.setState({ loading: false, error: 'Complete missing fields' });
      }
    } catch (error) {
      this.setState({ loading: false, error });
      console.log(error);
    }
  };

  render() {
    const {
      username, password, loading, error,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
USERNAME:
        </Text>
        <Input
          placeholder="Bob"
          onChangeText={text => this.onChangeText('username', text)}
          value={username}
        />
        <Text style={styles.label}>
PASSWORD:
        </Text>
        <Input
          placeholder="********"
          onChangeText={text => this.onChangeText('password', text)}
          value={password}
          secureTextEntry
        />
        <Button
          title="SIGN IN"
          onPress={this.signIn}
          style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 20 }}
        />
        {loading && <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />}
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  label: {
    alignSelf: 'flex-start',
    paddingLeft: '10%',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 10,
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
  error: {
    marginTop: 10,
    paddingHorizontal: '10%',
    color: COLORS.PRIMARY_TEXT_COLOR,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
});

SignInScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
