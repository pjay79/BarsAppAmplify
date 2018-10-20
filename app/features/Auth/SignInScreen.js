// @flow
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Animated,
} from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Auth, API, graphqlOperation } from 'aws-amplify';

// GraphQL
import GetUser from '../../graphql/queries/GetUser';
import CreateUser from '../../graphql/mutations/CreateUser';

// Components
import Button from '../../components/Button';
import Input from '../../components/Input';

// Config
import * as COLORS from '../../config/colors';
import { itemAnimation } from '../../config/animations';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

type State = {
  username: string,
  password: string,
  loading: boolean,
  error: string,
};

export default class SignInScreen extends PureComponent<Props, State> {
  animatedValue1 = new Animated.Value(0);

  animatedValue2 = new Animated.Value(0);

  animatedValue3 = new Animated.Value(0);

  state = {
    username: '',
    password: '',
    loading: false,
    error: '',
  };

  componentDidMount() {
    this.animateSections();
  }

  animateSections = () => {
    Animated.sequence([
      itemAnimation(this.animatedValue1),
      itemAnimation(this.animatedValue2),
      itemAnimation(this.animatedValue3),
    ]).start();
  };

  onChangeText = (key: string, value: string) => {
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
      this.setState({ loading: false, error: error.message });
      console.log(error.message);
    }
  };

  render() {
    const {
      username, password, loading, error,
    } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: this.animatedValue1 }}>
          <Text style={styles.label}>Username:</Text>
          <Input
            placeholder="Enter username"
            onChangeText={text => this.onChangeText('username', text)}
            value={username}
          />
        </Animated.View>
        <Animated.View style={{ opacity: this.animatedValue2 }}>
          <Text style={styles.label}>Password:</Text>
          <Input
            placeholder="********"
            onChangeText={text => this.onChangeText('password', text)}
            value={password}
            secureTextEntry
          />
        </Animated.View>
        <Animated.View style={{ opacity: this.animatedValue3 }}>
          <Button
            title="SIGN IN"
            onPress={this.signIn}
            style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 20, marginTop: 10 }}
          />
          {loading && <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />}
        </Animated.View>
        <Text style={styles.error}>{error}</Text>
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
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
  error: {
    marginTop: 10,
    paddingHorizontal: '10%',
    color: COLORS.TEXT_PRIMARY_COLOR,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
});
