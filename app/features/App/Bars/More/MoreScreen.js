// @flow
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Auth } from 'aws-amplify';

// Components
import Guidelines from './components/Guidelines';
import About from './components/About';

// Config
import * as COLORS from '../../../../config/colors';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

type State = {
  loading: boolean,
};

export default class MoreScreen extends PureComponent<Props, State> {
  state = {
    loading: false,
  };

  signOut = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      await Auth.signOut();
      navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <About />
        <Guidelines />
        <TouchableOpacity onPress={this.signOut}>
          <View style={styles.itemSignOut}>
            <Text style={styles.itemTextSignOut}>SIGN OUT</Text>
          </View>
        </TouchableOpacity>
        {loading && <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 30,
  },
  itemSignOut: {
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderTopColor: COLORS.DIVIDER_COLOR,
    borderBottomColor: COLORS.DIVIDER_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemTextSignOut: {
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.DEFAULT_PRIMARY_COLOR,
  },
});
