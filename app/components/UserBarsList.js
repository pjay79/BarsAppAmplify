import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import GetUserBars from '../graphql/queries/GetUserBars';
import * as COLORS from '../config/colors';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {}

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
    const {
      loading, refetch, networkStatus, bars,
    } = this.props;

    if (loading) {
      return null;
    }

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
    props: ({ data }) => ({
      loading: data.loading,
      refetch: data.refetch,
      networkStatus: data.networkStatus,
      bars: data.getUser ? data.getUser.bars.items : [],
    }),
  }),
)(UserBarsList);

UserBarsList.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
