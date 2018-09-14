import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';
import Swipeout from 'react-native-swipeout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MapLinks from './MapLinks';
import GetUserBars from '../graphql/queries/GetUserBars';
import ListBarMembers from '../graphql/queries/ListBarMembers';
import DeleteBarMember from '../graphql/mutations/DeleteBarMember';
import AddBarSubscription from '../graphql/subscriptions/AddBarSubscription';
import * as COLORS from '../config/colors';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isVisible: false,
  };

  componentDidMount() {
    const { id, data } = this.props;
    data.subscribeToMore(
      buildSubscription(gql(AddBarSubscription), gql(GetUserBars), 'User', id, 'auto'),
      buildSubscription(gql(AddBarSubscription), gql(ListBarMembers), 'BarMember', 'auto'),
    );
  }

  openWebsiteLink = (website) => {
    Linking.openURL(website);
  };

  openPhone = (phone) => {
    Linking.openURL(`tel://+${phone}`).catch(error => console.log(error));
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  deleteFavourite = async (barId) => {
    try {
      const { id, members, deleteBarMember } = this.props;
      const barMemberDeleted = await members.filter(
        member => member.userId === id && member.barId === barId,
      );
      console.log('Bar Member deleted: ', barMemberDeleted[0].id);
      const memberId = barMemberDeleted[0].id;
      await deleteBarMember(memberId);

      Alert.alert(
        'Success',
        'This bar has been deleted from your favourites.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'There was an error, please try again.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
  }

  renderItem = ({ item }) => {
    const { isVisible } = this.state;
    const swipeoutBtns = [
      {
        backgroundColor: COLORS.ACCENT_COLOR,
        onPress: () => this.deleteFavourite(item.id),
        text: 'DELETE',
      },
    ];
    return (
      <Swipeout right={swipeoutBtns} backgroundColor={COLORS.TEXT_PRIMARY_COLOR} autoClose>
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
              <MaterialCommunityIcons
                name="directions"
                size={18}
                color={COLORS.DARK_PRIMARY_COLOR}
              />
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
      </Swipeout>
    );
  };

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: COLORS.DIVIDER_COLOR,
        height: StyleSheet.hairlineWidth,
      }}
    />
  );

  render() {
    const { refetch, networkStatus, bars } = this.props;

    return (
      <FlatList
        data={_.orderBy(bars, ['createdAt'], ['desc'])}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        onRefresh={() => refetch()}
        refreshing={networkStatus === 4}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 14,
  },
  phone: {
    fontSize: 12,
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
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data }) => ({
      data,
      bars: data.getUser ? data.getUser.bars.items : [],
      refetch: data.refetch,
      networkStatus: data.networkStatus,
    }),
  }),
  graphql(gql(ListBarMembers), {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ data }) => ({
      data,
      members: data.listBarMembers ? data.listBarMembers.items : [],
    }),
  }),
  graphql(gql(DeleteBarMember), {
    options: ownProps => ({
      refetchQueries: [{
        query: gql(GetUserBars),
        variables: {
          id: ownProps.id,
        },
      }],
      fetchPolicy: 'network-only',
    }),
    props: ({ mutate }) => ({
      deleteBarMember: memberId => mutate({ variables: { id: memberId } }),
    }),
  }),
)(UserBarsList);

UserBarsList.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  members: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
  deleteBarMember: PropTypes.func.isRequired,
};
