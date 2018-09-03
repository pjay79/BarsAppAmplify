import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { graphqlMutation } from 'aws-appsync-react';
import Button from './Button';
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

      const { name, url } = details;
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
    const { details } = this.props;
    const { name, website } = details;
    const phone = details.formatted_phone_number;
    const location = details.vicinity;

    return (
      <View style={styles.content}>
        <Text>
          {name}
        </Text>
        <Text>
          {phone}
        </Text>
        <Text>
          {location}
        </Text>
        <Text>
          {website}
        </Text>
        <Button
          title="Add to Favourites"
          onPress={this.addToFavourites}
          style={{ backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR, marginTop: 10 }}
          textStyle={{ color: COLORS.TEXT_PRIMARY_COLOR }}
        />
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
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
});

BarDetails.propTypes = {
  details: PropTypes.shape().isRequired,
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
