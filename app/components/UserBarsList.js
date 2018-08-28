import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import GetUserBars from '../graphql/queries/GetUserBars';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';
// import UpdateBarSubscription from '../graphql/subscriptions/UpdateBarSubscription';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { subscribeToUserBars } = this.props;
    subscribeToUserBars();
  }

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => console.log('Go to bar details')}>
        <Text>
          {item.name}
        </Text>
        <Text>
          {item.phone}
        </Text>
        <Text>
          {item.location}
        </Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { bars, refetch, networkStatus } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={_.orderBy(bars, ['createdAt'], ['desc'])}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          onRefresh={() => refetch()}
          refreshing={networkStatus === 4}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    paddingLeft: 20,
  },
});

export default compose(
  graphql(gql(GetUserBars), {
    options: ownProps => ({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      variables: {
        id: ownProps.id,
      },
    }),
    props: ({ data, ownProps }) => ({
      refetch: data.refetch,
      networkStatus: data.networkStatus,
      bars: data.getUser ? data.getUser.bars.items : [],
      subscribeToUserBars: () => {
        data.subscribeToMore({
          document: gql(AddBarSubscription),
          updateQuery: (
            prev,
            {
              subscriptionData: {
                data: { onAddBar },
              },
            },
          ) => ({
            ...prev,
            getUser: {
              id: ownProps.id,
              username: ownProps.user,
              bars: {
                items: [onAddBar, ...prev.getUser.bars.items.filter(bar => bar.id !== onAddBar.id)],
                __typename: 'Bar',
              },
              __typename: 'UserBarsConnection',
            },
            __typename: 'User',
          }),
        });
      },
    }),
  }),
)(UserBarsList);

UserBarsList.propTypes = {
  subscribeToUserBars: PropTypes.func.isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
