import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  StyleSheet,
  SegmentedControlIOS,
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
import orderData from '../util/orderData';
import * as COLORS from '../config/colors';

class UserBarsList extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isVisible: false,
    options: ['Name', 'Created At'],
    selectedIndex: 0,
    property: 'name',
    direction: 'asc',
  };

  componentDidMount() {
    const { id, getUserBars } = this.props;
    getUserBars.subscribeToMore(
      buildSubscription(gql(AddBarSubscription), gql(GetUserBars), 'User', id, 'auto'),
    );
  }

  openWebsiteLink = (website) => {
    try {
      const supported = Linking.canOpenURL(website);
      if (supported) {
        Linking.openURL(website);
        console.log(website);
      } else {
        console.log('Website url not valid.');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  openPhone = (phone) => {
    try {
      Linking.openURL(`tel://${phone}`);
      console.log(phone);
    } catch (error) {
      console.log(error);
    }
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  toggleBarSortOrder = (event) => {
    const {
      options,
    } = this.state;
    this.setState({ property: _.camelCase(options[event.nativeEvent.selectedSegmentIndex]) });
    console.log(event.nativeEvent);
  }

  deleteFavourite = async (barId) => {
    try {
      const { id, members, deleteBarMember } = this.props;
      const barMemberDeleted = await members.filter(
        member => member.userId === id && member.barId === barId,
      );
      console.log('Bar Member deleted: ', barMemberDeleted[0].id);
      const memberId = barMemberDeleted[0].id;
      await deleteBarMember(memberId);

      Alert.alert('Success', 'This bar has been deleted from your favourites.', [{ text: 'OK' }], {
        cancelable: false,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error, please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

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
    const {
      property,
      direction,
      options,
      selectedIndex,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.flatListWrapper}>
          <FlatList
            data={orderData(bars, property, direction)}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            onRefresh={() => refetch()}
            refreshing={networkStatus === 4}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <View style={styles.segmentedControlWrapper}>
          <SegmentedControlIOS
            values={options}
            tintColor={COLORS.DEFAULT_PRIMARY_COLOR}
            selectedIndex={selectedIndex}
            onChange={event => this.toggleBarSortOrder(event)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
  flatListWrapper: {
    marginBottom: 30,
  },
  segmentedControlWrapper: {
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
      getUserBars: data,
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
      refetchQueries: [
        {
          query: gql(GetUserBars),
          variables: {
            id: ownProps.id,
          },
        },
      ],
      fetchPolicy: 'network-only',
    }),
    props: ({ mutate }) => ({
      deleteBarMember: memberId => mutate({ variables: { id: memberId } }),
    }),
  }),
)(UserBarsList);

UserBarsList.propTypes = {
  id: PropTypes.string.isRequired,
  getUserBars: PropTypes.shape().isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  members: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
  deleteBarMember: PropTypes.func.isRequired,
};
