import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Text, Dimensions, Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import * as COLORS from '../../../../../config/colors';

const SECTION = [
  {
    title: 'Tech',
    content:
      'This is a React Native app built using AWS Amplify, AWS AppSync, and the Google Places API.',
  },
  {
    title: 'Contact',
    content: 'https://www.github.com/pjay79',
  },
];

export default class About extends PureComponent {
  state = {
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

  render() {
    const { activeSections } = this.state;
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>ABOUT</Text>
        </View>
        <Accordion
          sections={SECTION}
          activeSections={activeSections}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          onChange={this.updateSections}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.ACCENT_COLOR,
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  sectionText: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 2,
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
});
