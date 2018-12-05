// @flow
import React, { PureComponent } from 'react';
import {
  View, Alert, FlatList, SegmentedControlIOS, StyleSheet, Platform,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { buildSubscription } from 'aws-appsync';
import { SearchBar } from 'react-native-elements';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import _ from 'lodash';

// GraphQL
import ListBars from '../../../../../graphql/queries/ListBars';
import GetUserBars from '../../../../../graphql/queries/GetUserBars';
import GetBarMember from '../../../../../graphql/queries/GetBarMember';
import CreateBarMember from '../../../../../graphql/mutations/CreateBarMember';
import CreateBarSubscription from '../../../../../graphql/subscriptions/CreateBarSubscription';

// Components
import AllBarsListItem from '../components/AllBarsListItem';

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
  createBarMember: Function,
  refetchBarMember: Function,
};

type State = {
  isVisible: boolean,
  adding: boolean,
  loading: boolean,
  query: string,
  barsData: Array<{ name: string }>,
  barsFilter: Array<{ name: string }>,
  options: Array<string>,
  selectedIndex: number,
  property: string,
  direction: string,
};

class AllBarsList extends PureComponent<Props, State> {
  state = {
    isVisible: false,
    adding: false,
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
    if (search === '') {
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

  componentDidMount() {
    const { data } = this.props;
    data.subscribeToMore(buildSubscription(gql(CreateBarSubscription), gql(ListBars)));
  }

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

  addToUserFavourites = async (barId) => {
    try {
      this.setState({ adding: true });

      const { createBarMember, refetchBarMember, userId } = this.props;

      const barMember = {
        userId,
        barId,
      };

      console.log(`userId: ${userId}, barId: ${barId}`);

      if (userId === '8bc7c298-49dc-45be-a7db-a7ca595a8c81') {
        console.log('Signin to add to favourites');
        this.setState({ adding: false });
        return;
      }

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

  keyExtractor = item => item.id;

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

  renderSeparator = () => <View style={styles.separator} />;

  refreshData = () => {
    const { refetch } = this.props;
    refetch();
  };

  render() {
    const { networkStatus, bars } = this.props;
    const {
      property, direction, options, selectedIndex, query, barsData,
    } = this.state;

    const data = query
      ? orderData(barsData, property, direction)
      : orderData(bars, property, direction);

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
  searchContainer: {
    backgroundColor: COLORS.TEXT_PRIMARY_COLOR,
  },
  searchInput: {
    backgroundColor: COLORS.BACKGROUND_COLOR,
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
