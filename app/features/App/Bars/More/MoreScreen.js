import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Auth } from 'aws-amplify';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../../../../config/colors';

export default class MoreScreen extends PureComponent {
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
      <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log('Go to ABOUT')}>
          <View style={styles.item}>
            <Text style={styles.itemText}>About</Text>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
              size={20}
              color={COLORS.DIVIDER_COLOR}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to CONTACT US')}>
          <View
            style={[
              styles.item,
              {
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
            ]}
          >
            <Text style={styles.itemText}>Contact Us</Text>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
              size={20}
              color={COLORS.DIVIDER_COLOR}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to FEEDBACK')}>
          <View style={styles.item}>
            <Text style={styles.itemText}>Send Feedback</Text>
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
              size={20}
              color={COLORS.DIVIDER_COLOR}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.signOut}>
          <View style={styles.itemSignOut}>
            <Text style={styles.itemTextSignOut}>SIGN OUT</Text>
          </View>
        </TouchableOpacity>
        {loading && <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderTopColor: COLORS.DIVIDER_COLOR,
    borderBottomColor: COLORS.DIVIDER_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontWeight: '400',
    letterSpacing: 2,
  },
  itemSignOut: {
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 15,
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

MoreScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
