import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Linking, StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MapLinks from './MapLinks';
import ListBars from '../graphql/queries/ListBars';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';
import * as COLORS from '../config/colors';

class AllBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isVisible: false,
  };

  componentDidMount() {
    const { data } = this.props;
    data.subscribeToMore(buildSubscription(gql(AddBarSubscription), gql(ListBars)));
  }

  openWebsiteLink = (website) => {
    Linking.openURL(website).catch(error => console.log(error));
  };

  openPhone = (phone) => {
    Linking.openURL(`tel://+${phone}`).catch(error => console.log(error));
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  renderItem = ({ item }) => {
    const { isVisible } = this.state;
    return (
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
          <TouchableOpacity onPress={() => this.openWebsiteLink(item.website)}>
            <MaterialCommunityIcons name="web" size={18} color={COLORS.ACCENT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleMapLinks}>
            <MaterialCommunityIcons name="directions" size={18} color={COLORS.DARK_PRIMARY_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openPhone(item.phone)}>
            <Foundation name="telephone" size={18} color={COLORS.PRIMARY_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
        <MapLinks
          isVisible={isVisible}
          onCancelPressed={this.toggleMapLinks}
          onAppPressed={this.toggleMapLinks}
          onBackButtonPressed={this.toggleMapLinks}
          name={item.name}
          lat={parseFloat(item.lat)}
          lng={parseFloat(item.lng)}
          id={item.id}
        />
      </View>
    );
  };

  renderSeparator = () => <View style={styles.separator} />;

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
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  details: {
    width: '90%',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
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
  separator: {
    backgroundColor: COLORS.DIVIDER_COLOR,
    height: StyleSheet.hairlineWidth,
  },
});

export default compose(
  graphql(gql(ListBars), {
    options: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data }) => ({
      data,
      bars: data.listBars ? data.listBars.items : [],
      refetch: data.refetch,
      networkStatus: data.networkStatus,
    }),
  }),
)(AllBarsList);

AllBarsList.propTypes = {
  data: PropTypes.shape().isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
