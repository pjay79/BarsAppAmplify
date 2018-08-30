import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';
import GetUserBars from '../graphql/queries/GetUserBars';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { id, data } = this.props;
    console.log(data);
    data.subscribeToMore(
      buildSubscription(gql(AddBarSubscription), gql(GetUserBars), 'User', id, 'auto'),
    );
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
    const { refetch, networkStatus, bars } = this.props;

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
      fetchPolicy: 'cache-and-network',
      variables: {
        id: ownProps.id,
      },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data }) => ({
      data,
      bars: data.getUser ? data.getUser.bars.items : [],
      refetch: data.refetch,
      networkStatus: data.networkStatus,
    }),
  }),
)(UserBarsList);

UserBarsList.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
