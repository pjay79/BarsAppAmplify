// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SegmentedControlIOS,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Auth } from 'aws-amplify';
import { SearchBar } from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import _ from 'lodash';

// GraphQL
import GetUserBars from '../../../../../graphql/queries/GetUserBars';
import GetBarMember from '../../../../../graphql/queries/GetBarMember';
import DeleteBarMember from '../../../../../graphql/mutations/DeleteBarMember';

// Components
import UserBarsListItem from '../components/UserBarsListItem';

// Utils
import orderData from '../../../../../utils/orderData';
import linkingPhone from '../../../../../utils/linkingPhone';
import linkingWebsite from '../../../../../utils/linkingWebsite';

// Config
import * as COLORS from '../../../../../config/colors';

// Types
type Props = {
  userId: string,
  bars: Array<{ name: string }>,
  networkStatus: number,
  data: { subscribeToMore: Function },
  refetch: Function,
  refetchBarMember: Function,
  deleteBarMember: Function,
};

type State = {
  isVisible: boolean,
  deleting: boolean,
  loading: boolean,
  query: string,
  barsData: Array<{ name: string }>,
  barsFilter: Array<{ name: string }>,
  options: Array<string>,
  selectedIndex: number,
  property: string,
  direction: string,
};

class UserBarsList extends PureComponent<Props, State> {
  state = {
    isVisible: false,
    deleting: false,
    loading: false,
    barsData: [],
    barsFilter: [],
    query: '',
    options: ['Name', 'Created At'],
    selectedIndex: 0,
    property: 'name',
    direction: 'asc',
  };

  addQuery = _.debounce((search) => {
    const { bars } = this.props;
    if (!search) {
      this.setState({
        loading: false,
        query: '',
        barsData: bars,
      });
    } else {
      this.setState(
        {
          loading: true,
          query: search,
          barsFilter: bars,
        },
        () => {
          const { barsFilter, query } = this.state;
          const results = barsFilter.filter(
            bar => bar.name.toLowerCase().includes(query.toLowerCase()),
          );
          this.setState({ barsData: results });
        },
      );
    }
  }, 250);

  clearQuery = () => {
    const { bars } = this.props;
    this.setState({
      barsData: bars,
      loading: false,
    });
  };

  openWebsiteLink = (website) => {
    linkingWebsite(website);
  };

  openPhone = (phone) => {
    linkingPhone(phone);
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  toggleBarSortOrderIOS = (event) => {
    const { options } = this.state;
    console.log(event);
    this.setState(({
      selectedIndex: event.nativeEvent.selectedSegmentIndex,
      property: _.camelCase(options[event.nativeEvent.selectedSegmentIndex]),
    }));
  };

  toggleBarSortOrderAndroid = (index) => {
    const { options } = this.state;
    console.log(index);
    this.setState(({
      selectedIndex: index,
      property: _.camelCase(options[index]),
    }));
  };

  signOut = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      await Auth.signOut();
      navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  deleteFavourite = async (barId) => {
    try {
      this.setState({ deleting: true });

      const {
        userId, refetchBarMember, deleteBarMember, bars,
      } = this.props;

      console.log(`userId: ${userId}, barId: ${barId}`);

      const barMemberAdded = await refetchBarMember({ userId, barId });
      console.log(barMemberAdded);
      console.log(`id: ${barMemberAdded.data.getBarMember.id}`);

      if (barMemberAdded.data.getBarMember !== null && bars.length > 1) {
        await deleteBarMember(barMemberAdded.data.getBarMember.id);
        console.log('Deleted!');
      }
      this.setState({ deleting: false });
    } catch (error) {
      this.setState({ deleting: false });
      Alert.alert('Error', 'There was an error, please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => {
    const { isVisible, deleting } = this.state;

    return (
      <UserBarsListItem
        item={item}
        deleteFavourite={this.deleteFavourite}
        openWebsiteLink={this.openWebsiteLink}
        toggleMapLinks={this.toggleMapLinks}
        openPhone={this.openPhone}
        isVisible={isVisible}
        deleting={deleting}
      />
    );
  };

  renderHeader = () => {
    const { loading, query } = this.state;
    return (
      <SearchBar
        lightTheme
        icon={{ type: 'font-awesome', name: 'search' }}
        clearIcon
        showLoadingIcon={loading}
        value={query}
        onChangeText={this.addQuery}
        onClearText={this.clearQuery}
        autoCorrect={false}
        placeholder="Search bars..."
        containerStyle={styles.searchContainer}
        inputStyle={styles.searchInput}
      />
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

  refreshData = () => {
    const { refetch } = this.props;
    refetch();
  };

  render() {
    const { networkStatus, bars, userId } = this.props;
    const {
      property, direction, options, selectedIndex, barsData, query, loading,
    } = this.state;

    const data = query
      ? orderData(barsData, property, direction)
      : orderData(bars, property, direction);

    if (userId === '8bc7c298-49dc-45be-a7db-a7ca595a8c81') {
      return (
        <View style={styles.emptyContainer}>
          <TouchableOpacity onPress={this.signOut}>
            <Text style={styles.textSignOut}>Signup to add favourites</Text>
          </TouchableOpacity>
          <View>{loading && <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />}</View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.flatListWrapper}>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onRefresh={this.refreshData}
            refreshing={networkStatus === 4}
            ListHeaderComponent={this.renderHeader}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <View style={styles.segmentedControlWrapper}>
          {Platform.OS === 'ios' ? (
            <SegmentedControlIOS
              values={options}
              selectedIndex={selectedIndex}
              onChange={event => this.toggleBarSortOrderIOS(event)}
              tintColor={COLORS.DEFAULT_PRIMARY_COLOR}
            />
          ) : (
            <SegmentedControlTab
              values={options}
              selectedIndex={selectedIndex}
              onTabPress={index => this.toggleBarSortOrderAndroid(index)}
              activeTabStyle={{ backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR }}
              tabTextStyle={{ color: COLORS.DEFAULT_PRIMARY_COLOR }}
              tabStyle={{ borderColor: COLORS.DEFAULT_PRIMARY_COLOR }}
            />
          )
          }
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  date: {
    fontSize: 12,
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  iconWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
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
  searchContainer: {
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
  },
  searchInput: {
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  textSignOut: {
    textAlign: 'center',
    fontWeight: '800',
    marginVertical: 20,
    color: COLORS.DEFAULT_PRIMARY_COLOR,
  },
});

export default compose(
  graphql(gql(GetUserBars), {
    options: ownProps => ({
      variables: {
        id: ownProps.userId,
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data }) => ({
      loading: data.loading,
      bars: data.getUser ? data.getUser.bars.items : [],
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
  graphql(gql(DeleteBarMember), {
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
      deleteBarMember: memberId => mutate({ variables: { id: memberId } }),
    }),
  }),
)(UserBarsList);
