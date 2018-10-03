// @flow
import React, { PureComponent } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Auth } from 'aws-amplify';

// Components
import AllBarsList from './containers/AllBarsList';

// Config
import * as COLORS from '../../../../config/colors';

// Types
type State = {
  userId: string,
  loading: boolean,
};

export default class AllBarsScreen extends PureComponent<void, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    userId: '',
    loading: false,
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    try {
      this.setState({ loading: true });
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.signInUserSession.accessToken.payload.sub;
      this.setState({ userId, loading: false });
      console.log(userId);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  render() {
    const { userId, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <AllBarsList userId={userId} barId="" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
  },
  loading: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
