// @flow
import React, { PureComponent } from 'react';
import {
  ScrollView,
  Dimensions,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { Auth } from 'aws-amplify';

// Components
import ListItemDetails from './containers/ListItemDetails';
import MapLinks from '../../../../components/MapLinks';

// Services
import nearbyPlaceDetailsSearch from '../../../../services/nearbyPlaceDetailsSearch';

// Utils
import linkingPhone from '../../../../utils/linkingPhone';
import linkingWebsite from '../../../../utils/linkingWebsite';

// Config
import * as COLORS from '../../../../config/colors';

// Types
type Props = {
  navigation: NavigationScreenProp<NavigationRoute>,
};

type State = {
  details: { name: string, website: string, formatted_phone_number: string },
  userId: string,
  isVisible: boolean,
  loading: boolean,
};

export default class ListItemDetailsScreen extends PureComponent<Props, State> {
  state = {
    details: { name: '', website: '', formatted_phone_number: '' },
    userId: '',
    isVisible: false,
    loading: false,
  };

  componentDidMount() {
    this.getAllDetails();
  }

  getAllDetails = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      const placeId = navigation.getParam('bar').place_id;
      const response = await nearbyPlaceDetailsSearch(placeId);
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = await currentUser.signInUserSession.accessToken.payload.sub;
      this.setState({ details: response.data.result, userId, loading: false });
      this.animateButton();
      console.log(response);
      console.log(currentUser.username, userId);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  openWebsiteLink = () => {
    try {
      const {
        details: { website },
      } = this.state;
      linkingWebsite(website);
    } catch (error) {
      console.log(error);
    }
  };

  openPhone = () => {
    try {
      const { details } = this.state;
      const phone = details.formatted_phone_number;
      linkingPhone(phone);
    } catch (error) {
      console.log(error);
    }
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  render() {
    const { navigation } = this.props;
    const barId = navigation.getParam('bar').place_id;
    const { lat, lng } = navigation.getParam('bar').geometry.location;
    const {
      details, isVisible, loading, userId,
    } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerContentStyle}>
          <ListItemDetails
            barId={barId}
            lat={lat}
            lng={lng}
            details={details}
            userId={userId}
            openWebsiteLink={this.openWebsiteLink}
            openPhone={this.openPhone}
            toggleMapLinks={this.toggleMapLinks}
          />
          <MapLinks
            isVisible={isVisible}
            onCancelPressed={this.toggleMapLinks}
            onAppPressed={this.toggleMapLinks}
            onBackButtonPressed={this.toggleMapLinks}
            name={details.name}
            lat={lat}
            lng={lng}
            barId={barId}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  containerContentStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loading: {
    paddingTop: 20,
  },
  buttonContainer: {
    backgroundColor: COLORS.ACCENT_COLOR,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimensions.get('window').width,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY_COLOR,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 2,
  },
});
