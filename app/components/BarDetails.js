import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { graphqlMutation } from 'aws-appsync-react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetBar from '../graphql/queries/GetBar';
import ListBars from '../graphql/queries/ListBars';
import ListBarMembers from '../graphql/queries/ListBarMembers';
import GetUserBars from '../graphql/queries/GetUserBars';
import CreateBar from '../graphql/mutations/CreateBar';
import UpdateBar from '../graphql/mutations/UpdateBar';
import CreateBarMember from '../graphql/mutations/CreateBarMember';
import * as COLORS from '../config/colors';

class BarDetails extends Component {
  addToFavourites = async () => {
    try {
      const {
        id,
        lat,
        lng,
        details,
        userId,
        bar,
        createBarMember,
        createBar,
        updateBar,
      } = this.props;

      const { name, url, website } = details;
      const phone = details.formatted_phone_number;
      const location = details.vicinity;

      const barData = {
        id,
        name,
        createdAt: '',
        updatedAt: '',
        phone,
        location,
        lat,
        lng,
        url,
        website,
        addedBy: userId,
      };

      const barMember = {
        id: -1,
        createdAt: '',
        updatedAt: '',
        userId,
        barId: id,
      };

      if (bar === null) {
        createBarMember({ ...barMember });
        createBar({ ...barData });
      } else {
        createBarMember({ ...barMember });
        updateBar({ ...barData });
      }
      Alert.alert(
        'Success',
        'This bar has been added to your favourites.',
        [{ text: 'OK', onPress: () => console.log('Alert closed.') }],
        { cancelable: false },
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'There was an error, please try again.',
        [{ text: 'OK', onPress: () => console.log('Alert closed.') }],
        { cancelable: false },
      );
    }
  };

  render() {
    const {
      details,
      openWebsiteLink,
      openPhone,
      toggleMapLinks,
    } = this.props;
    const { name } = details;
    const phone = details.formatted_phone_number;
    const location = details.vicinity;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.header}>
            {name}
          </Text>
          <Text style={styles.location}>
            {location}
          </Text>
          <Text style={styles.phone}>
            {phone}
          </Text>
          <TouchableOpacity onPress={this.addToFavourites} style={styles.iconHeader}>
            <Ionicons name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'} size={25} color={COLORS.TEXT_PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
        <View style={styles.iconGroup}>
          <View style={styles.iconLeft}>
            <TouchableOpacity onPress={openWebsiteLink}>
              <MaterialCommunityIcons name="web" size={25} color={COLORS.TEXT_PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconMiddle}>
            <TouchableOpacity onPress={toggleMapLinks}>
              <MaterialCommunityIcons name="directions" size={25} color={COLORS.TEXT_PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRight}>
            <TouchableOpacity onPress={openPhone}>
              <Foundation name="telephone" size={25} color={COLORS.TEXT_PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.subHeader}>
          OPENING HOURS:
          </Text>
          {details.opening_hours
            && details.opening_hours.weekday_text.map(data => (
              <View key={data}>
                <Text style={styles.openingHoursText}>
                  {data}
                </Text>
              </View>
            ))}
          {!details.opening_hours
            && (
            <Text>
              UNAVAILABLE
            </Text>
            )
          }
        </View>
        <View style={[styles.content, { marginBottom: 10, paddingBottom: 0 }]}>
          <Text style={styles.subHeader}>
          REVIEWS:
          </Text>
          {details.reviews
            && details.reviews.map(data => (
              <View key={data.text} style={styles.reviewContainer}>
                <Text style={styles.author}>
                  Posted by
                  {' '}
                  {data.author_name}
                  {' '}
                  {data.relative_time_description}
                  .
                </Text>
                <Text style={styles.rating}>
                  Rating:
                  {' '}
                  {data.rating}
                  /5
                </Text>
                <Text style={styles.text}>
                  {data.text}
                </Text>
              </View>
            ))}
          {!details.reviews
            && (
            <Text>
              NONE
            </Text>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loading: {
    paddingTop: 20,
  },
  top: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: COLORS.ACCENT_COLOR,
    width: Dimensions.get('window').width,
    borderTopColor: COLORS.TEXT_PRIMARY_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY_COLOR,
    marginBottom: 10,
    letterSpacing: 4,
  },
  location: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY_COLOR,
    marginBottom: 5,
  },
  phone: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
  iconHeader: {
    marginTop: 10,
  },
  iconGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.DARK_PRIMARY_COLOR,
  },
  iconMiddle: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_TEXT_COLOR,
  },
  iconRight: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_PRIMARY_COLOR,
  },
  content: {
    width: Dimensions.get('window').width * 0.95,
    paddingVertical: 20,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: COLORS.DIVIDER_COLOR,
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
  },
  subHeader: {
    fontWeight: '600',
    marginBottom: 20,
  },
  openingHoursText: {
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  reviewContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 15,
    borderBottomColor: COLORS.DIVIDER_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  author: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  rating: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.ACCENT_COLOR,
  },
  text: {
    marginVertical: 20,
    textAlign: 'justify',
  },
});

BarDetails.propTypes = {
  details: PropTypes.shape().isRequired,
  openWebsiteLink: PropTypes.func.isRequired,
  openPhone: PropTypes.func.isRequired,
  toggleMapLinks: PropTypes.func.isRequired,
  bar: PropTypes.shape(),
};

BarDetails.defaultProps = {
  bar: null,
};

export default compose(
  graphql(gql(GetBar), {
    options: ownProps => ({
      variables: {
        id: ownProps.id,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      bar: data.getBar ? data.getBar : null,
    }),
  }),
  graphql(gql(CreateBarMember), {
    props: ({ mutate }) => ({
      options: {
        update: (proxy, { data: { createBarMember } }) => {
          try {
            const data = proxy.readQuery({ query: ListBarMembers });
            data.listBarMembers.items = [
              ...data.listBarMembers.items.filter(member => member.id !== createBarMember.id),
              createBarMember,
            ];
            proxy.writeQuery({ query: ListBarMembers, data });
          } catch (error) {
            console.log(error);
          }
        },
      },
      createBarMember: member => mutate({
        variables: member,
        optimisticResponse: () => ({
          createBarMember: {
            ...member,
            __typename: 'BarMember',
          },
        }),
      }),
    }),
  }),
  graphqlMutation(gql(UpdateBar), gql(GetUserBars), 'Bar'),
  graphqlMutation(gql(CreateBar), gql(ListBars), 'Bar'),
)(BarDetails);
