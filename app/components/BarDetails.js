import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { graphqlMutation } from 'aws-appsync-react';
import { API, graphqlOperation } from 'aws-amplify';
import Button from './Button';
import GetBar from '../graphql/queries/GetBar';
import ListBars from '../graphql/queries/ListBars';
import GetUserBars from '../graphql/queries/GetUserBars';
import CreateBar from '../graphql/mutations/CreateBar';
import UpdateBar from '../graphql/mutations/UpdateBar';
import CreateBarMember from '../graphql/mutations/CreateBarMember';
import * as COLORS from '../config/colors';

class BarDetails extends Component {
  state = {
    loading: false,
  };

  addToFavourites = async () => {
    try {
      this.setState({ loading: true });

      const {
        id, lat, lng, details, userId, bar, createBar, updateBar,
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

      if (bar === null) {
        await this.addToUserFavourites(userId, id);
        createBar({ ...barData });
      } else {
        await this.addToUserFavourites(userId, id);
        updateBar({ ...barData });
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  addToUserFavourites = async (userId, barId) => {
    try {
      await API.graphql(graphqlOperation(CreateBarMember, { userId, barId }));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { loading } = this.state;
    const { details } = this.props;
    const { name, url } = details;
    const phone = details.formatted_phone_number;
    const location = details.vicinity;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />
        </View>
      );
    }

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
          {url}
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
      fetchPolicy: 'cache-and-network',
      variables: {
        id: ownProps.id,
      },
    }),
    props: ({ data }) => ({
      bar: data.getBar ? data.getBar : null,
    }),
  }),
  graphqlMutation(gql(UpdateBar), gql(GetUserBars), 'Bar'),
  graphqlMutation(gql(CreateBar), gql(ListBars), 'Bar'),
  // graphqlMutation(gql(CreateBarMember), [gql(ListBars), gql(GetUserBars)], 'BarMember'),
)(BarDetails);
