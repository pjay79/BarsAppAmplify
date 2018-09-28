import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View, Alert, FlatList, Linking, SegmentedControlIOS, StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import _ from 'lodash';

// GraphQL
import ListBars from '../../../../../graphql/queries/ListBars';
import GetUserBars from '../../../../../graphql/queries/GetUserBars';
import GetBarMember from '../../../../../graphql/queries/GetBarMember';
import CreateBarMember from '../../../../../graphql/mutations/CreateBarMember';
import CreateBarSubscription from '../../../../../graphql/subscriptions/CreateBarSubscription';

// Components
import AllBarsListItem from '../components/AllBarsListItem';

// Util
import orderData from '../../../../../util/orderData';

// Config
import * as COLORS from '../../../../../config/colors';

class AllBarsList extends PureComponent {
  static propTypes = {
    data: PropTypes.shape().isRequired,
    userId: PropTypes.string.isRequired,
    bars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    refetch: PropTypes.func.isRequired,
    networkStatus: PropTypes.number.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  state = {
    isVisible: false,
    adding: false,
    options: ['Name', 'Created At'],
    selectedIndex: 0,
    property: 'name',
    direction: 'asc',
  };

  componentDidMount() {
    const { data } = this.props;
    data.subscribeToMore(buildSubscription(gql(CreateBarSubscription), gql(ListBars)));
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
    const { options } = this.state;
    this.setState({
      property: _.camelCase(options[event.nativeEvent.selectedSegmentIndex]),
    });
    console.log(event.nativeEvent);
  };

  addToUserFavourites = async (barId) => {
    try {
      this.setState({ adding: true });

      const { userId, createBarMember, refetchBarMember } = this.props;

      const barMember = {
        userId,
        barId,
      };

      console.log(`userId: ${userId}, barId: ${barId}`);

      const barMemberAdded = await refetchBarMember({ userId, barId });
      console.log(barMemberAdded);

      if (barMemberAdded.data.getBarMember === null) {
        await createBarMember({ ...barMember });
        console.log('Added!');
      } else if (barMemberAdded.data.getBarMember !== null) {
        console.log('Already added.');
      }

      this.setState({ adding: false });
    } catch (error) {
      console.log(error);
      this.setState({ adding: false });
      Alert.alert('Error', 'There was an error, please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  renderItem = ({ item }) => {
    const { isVisible, adding } = this.state;

    return (
      <AllBarsListItem
        item={item}
        addToUserFavourites={this.addToUserFavourites}
        openWebsiteLink={this.openWebsiteLink}
        toggleMapLinks={this.toggleMapLinks}
        openPhone={this.openPhone}
        isVisible={isVisible}
        adding={adding}
      />
    );
  };

  renderSeparator = () => <View style={styles.separator} />;

  keyExtractor = item => item.id;

  refreshData = () => {
    const { refetch } = this.props;
    refetch();
  }

  render() {
    const { networkStatus, bars } = this.props;
    const {
      property, direction, options, selectedIndex,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.flatListWrapper}>
          <FlatList
            data={orderData(bars, property, direction)}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onRefresh={this.refreshData}
            refreshing={networkStatus === 4}
            ItemSeparatorComponent={this.renderSeparator}
            initialNumToRender={20}
            windowSize={3}
            removeClippedSubviews
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
  loading: {
    paddingTop: 20,
  },
  separator: {
    backgroundColor: COLORS.DIVIDER_COLOR,
    height: StyleSheet.hairlineWidth,
  },
  flatListWrapper: {
    flex: 1,
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
  graphql(gql(ListBars), {
    options: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data }) => ({
      data,
      loading: data.loading,
      bars: data.listBars ? data.listBars.items : [],
      refetch: data.refetch,
      networkStatus: data.networkStatus,
    }),
  }),
  graphql(gql(GetBarMember), {
    options: ownProps => ({
      variables: {
        userId: ownProps.userId,
        barId: ownProps.barId,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      loading: data.loading,
      refetchBarMember: data.refetch,
      getBarMember: data.getBarMember ? data.getBarMember : null,
    }),
  }),
  graphql(gql(CreateBarMember), {
    options: ownProps => ({
      refetchQueries: [
        {
          query: gql(GetUserBars),
          variables: {
            id: ownProps.userId,
          },
        },
      ],
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ mutate }) => ({
      createBarMember: member => mutate({ variables: member }),
    }),
  }),
)(AllBarsList);
