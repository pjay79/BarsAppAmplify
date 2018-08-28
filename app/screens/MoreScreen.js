import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Auth from '@aws-amplify/auth';
import Button from '../components/Button';
import * as COLORS from '../config/colors';

export default class MoreScreen extends Component {
  static navigationOptions = {
    title: 'More',
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  };

  state = {
    loading: false,
  };

  signOut = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    await Auth.signOut()
      .then((data) => {
        navigation.navigate('Auth');
        console.log(data);
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <Button
          title="Sign Out"
          onPress={this.signOut}
          style={{ backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR }}
        />
        {loading && <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

MoreScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
