import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import ListBars from '../graphql/queries/ListBars';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';
// import CreateBarSubscription from '../graphql/subscriptions/CreateBarSubscription';

class AllBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { subscribeToNewBars } = this.props;
    subscribeToNewBars();
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
  graphql(gql(ListBars), {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: ({ data }) => ({
      refetch: data.refetch,
      networkStatus: data.networkStatus,
      bars: data.listBars ? data.listBars.items : [],
      subscribeToNewBars: () => {
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
            listBars: {
              items: [onAddBar, ...prev.listBars.items.filter(bar => bar.id !== onAddBar.id)],
              __typename: 'Bar',
            },
            __typename: 'BarConnection',
          }),
        });
      },
    }),
  }),
)(AllBarsList);

AllBarsList.propTypes = {
  subscribeToNewBars: PropTypes.func.isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
