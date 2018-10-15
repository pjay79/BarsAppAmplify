// @flow
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
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Auth } from 'aws-amplify';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import * as COLORS from '../../../../config/colors';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

type State = {
  loading: boolean,
};

const SECTIONS = [
  {
    title: 'About',
    content:
      'This app was built using React Native, AWS Amplify, and AWS AppSync. This is a serverless mobile app.',
  },
  {
    title: 'Safe Drinking',
    content:
      'Set yourself limits and stick to them. Alternate between alcoholic and non-alcoholic drinks. Drink slowly. Try drinks with a lower alcohol content. Have something to eat while or before you have an alcoholic drink. Dilute your alcoholic drink by adding water or ice.',
  },
  {
    title: 'Contact',
    content: 'info@barfinder.com',
  },
];

export default class MoreScreen extends PureComponent<Props, State> {
  static navigationOptions = {
    title: 'More',
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  };

  state = {
    loading: false,
    activeSections: [],
  };

  renderHeader = section => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{section.title}</Text>
      <Ionicons
        name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
        size={20}
        color={COLORS.DIVIDER_COLOR}
      />
    </View>
  );

  renderContent = section => (
    <View style={styles.content}>
      <Text>{section.content}</Text>
    </View>
  );

  updateSections = (activeSections) => {
    this.setState({ activeSections });
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
    const { loading, activeSections } = this.state;
    return (
      <View style={styles.container}>
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          onChange={this.updateSections}
        />
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
  content: {
    padding: 20,
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
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
