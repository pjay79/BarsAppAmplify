import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, Alert, TouchableOpacity, FlatList, Linking, StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';
import Swipeout from 'react-native-swipeout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MapLinks from './MapLinks';
import CreateBarMember from '../graphql/mutations/CreateBarMember';
import UpdateBar from '../graphql/mutations/UpdateBar';
import ListBars from '../graphql/queries/ListBars';
import ListBarMembers from '../graphql/queries/ListBarMembers';
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

  addToUserFavourites = async (bar) => {
    try {
      const {
        userId,
        members,
        createBarMember,
        updateBar,
      } = this.props;

      const {
        id,
        name,
        phone,
        location,
        lat,
        lng,
        url,
        website,
        addedBy,
      } = bar;

      const barData = {
        id,
        name,
        phone,
        location,
        lat,
        lng,
        url,
        website,
        addedBy,
      };

      const barMember = {
        userId,
        barId: id,
      };

      const barMemberAdded = await members.filter(
        member => member.userId === userId && member.barId === id,
      );
      console.log(barMemberAdded);

      if (barMemberAdded.length === 0) {
        await createBarMember({ ...barMember });
        await updateBar({ ...barData });
        Alert.alert(
          'Success',
          'This bar has been added to your favourites.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Already added',
          'This bar is already in your favourites.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'There was an error, please try again.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
  };

  renderItem = ({ item }) => {
    const { isVisible } = this.state;
    const swipeoutBtns = [
      {
        backgroundColor: COLORS.ACCENT_COLOR,
        onPress: () => this.addToUserFavourites(item),
        text: 'LIKE',
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
      </Swipeout>
    );
  };

  renderSeparator = () => <View style={styles.separator} />;

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
  separator: {
    backgroundColor: COLORS.DIVIDER_COLOR,
    height: StyleSheet.hairlineWidth,
  },
});

export default compose(
  graphql(gql(ListBars), {
    options: {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data }) => ({
      data,
      bars: data.listBars ? data.listBars.items : [],
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
      members: data.listBarMembers ? data.listBarMembers.items : null,
    }),
  }),
  graphql(gql(CreateBarMember), {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ mutate }) => ({
      createBarMember: member => mutate({
        variables: member,
      }),
    }),
  }),
  graphql(gql(UpdateBar), {
    options: {
      fetchPolicy: 'network-only',
    },
    props: ({ mutate }) => ({
      updateBar: barData => mutate({
        variables: barData,
      }),
    }),
  }),
)(AllBarsList);

AllBarsList.propTypes = {
  data: PropTypes.shape().isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};
