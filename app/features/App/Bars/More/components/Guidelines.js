import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Text, Dimensions, Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import * as COLORS from '../../../../../config/colors';

const SECTION = [
  {
    title: 'Reducing the risk of alcohol-related harm',
    content:
      'You should drink no more than 2 standard drinks on any given day. The more alcohol you drink, the greater your risk of injury or disease over the course of your life. If you drink less than 2 standard drinks per day, your risk of dying from an alcohol-related injury is less than 1 in 100. The more you drink, the greater your risk.',
  },
  {
    title: 'Reducing the risk of injury while drinking',
    content:
      'You should drink no more than 4 standard drinks on any one occasion. The more alcohol you drink in a single session, the greater the risk of you being injured. Drinking 4 standard drinks more than doubles your risk of injury in the following 6 hours. For every drink you have after that, you put yourself in more danger. Generally, women will become more intoxicated on less alcohol than men. However, men often behave more dangerously when drinking. Every drinking session you have adds up over your life (see guideline 1).',
  },
  {
    title: 'Young people under age',
    content:
      'For young people under 18 years of age (or 21 in some countries), abstaining from alcohol is the safest option. This is because young people are more likely to behave dangerously while drinking, they often drink more and take more risks. Young people’s brains are still developing during their teenage years. Drinking alcohol may impact its development and lead to health issues later in life. The earlier a young person is introduced to alcohol, the more likely they are to develop these complications. Young people are also more likely to develop alcohol dependence later in life if they’re introduced to alcohol too early. Young people should therefore delay their first drink for as long as possible.',
  },
  {
    title: 'Pregnancy and breastfeeding',
    content:
      'If you are pregnant, are planning a pregnancy, or are breastfeeding, avoiding alcohol is the safest option. Drinking while pregnant can cause bleeding, miscarriage, premature birth or stillbirth. Alcohol can travel through the placenta to the unborn baby. As a result, drinking while pregnant can cause a range of physical, mental, behavioural and learning disabilities for the baby. Read more about Fetal Alcohol Spectrum Disorder (FASD). Drinking alcohol can also pass into breast milk and reduce its availability. This can impact a baby’s feeding and sleeping patterns and its development. Read more about pregnancy, breast feeding and alcohol',
  },
  {
    title: 'Other factors to consider',
    content:
      'Not drinking is the safest option if you are: Involved in, or supervising, risky activities including driving, operating machinery or water sports. Supervising young people. You should get advice from your doctor about drinking if: You are taking any medicines, including prescription or over-the-counter medicines. You have an alcohol-related or other physical condition, that can be affected by alcohol. You have mental health issues. You may have an increased risk of harm if you: Are under 18 years of age. Are over 60 years of age. Have a family history of alcohol dependence. Use illegal drugs',
  },
];

export default class Guidelines extends PureComponent {
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
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>GUIDELINES</Text>
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
  container: {
    marginBottom: 40,
  },
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
