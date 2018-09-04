import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GetUserBars from '../graphql/queries/GetUserBars';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';
import * as COLORS from '../config/colors';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { id, data } = this.props;
    data.subscribeToMore(
      buildSubscription(gql(AddBarSubscription), gql(GetUserBars), 'User', id, 'auto'),
    );
  }

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.header}>
          {item.name}
        </Text>
        <Text style={styles.location}>
          {item.location}
        </Text>
        <Text style={styles.phone}>
          {item.phone}
        </Text>
      </View>
      <View style={styles.iconWrapper}>
        <TouchableOpacity onPress={() => console.log('Bar selected.')}>
          <MaterialCommunityIcons name="web" size={20} color={COLORS.ACCENT_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Bar selected.')}>
          <MaterialCommunityIcons name="directions" size={20} color={COLORS.DARK_PRIMARY_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Bar selected.')}>
          <MaterialCommunityIcons name="phone" size={20} color={COLORS.PRIMARY_TEXT_COLOR} />
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  details: {},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
  },
  phone: {
    fontSize: 14,
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  iconWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default compose(
  graphql(gql(GetUserBars), {
    options: ownProps => ({
      variables: {
        id: ownProps.id,
      },
      fetchPolicy: 'cache-and-network',
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
