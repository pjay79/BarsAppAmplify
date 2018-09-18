import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ScrollView, Dimensions, View, StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { Auth } from 'aws-amplify';
import nearbyPlaceDetailsSearch from '../../../../services/nearbyPlaceDetailsSearch';
import BarDetails from '../../../../components/BarDetails';
import MapLinks from '../../../../components/MapLinks';
import Button from '../../../../components/Button';
import * as COLORS from '../../../../config/colors';

export default class BarDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('bar').name,
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  });

  state = {
    details: {},
    userId: '',
    isVisible: false,
    loading: false,
  };

  componentDidMount() {
    this.getBarDetails();
    this.getUser();
  }

  getBarDetails = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      const placeId = navigation.getParam('bar').place_id;
      const response = await nearbyPlaceDetailsSearch(placeId);
      this.setState({ details: response.data.result, loading: false });
      console.log(response);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  getUser = async () => {
    try {
      this.setState({ loading: true });
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.signInUserSession.accessToken.payload.sub;
      this.setState({ userId, loading: false });
      console.log(userId);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  openWebsiteLink = () => {
    try {
      const { details: { website } } = this.state;
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

  openPhone = () => {
    try {
      const { details } = this.state;
      const phone = details.formatted_phone_number;
      Linking.openURL(`tel://${phone}`);
      console.log(phone);
    } catch (error) {
      console.log(error);
    }
  };

  toggleMapLinks = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  render() {
    const { navigation } = this.props;
    const id = navigation.getParam('bar').place_id;
    const { lat, lng } = navigation.getParam('bar').geometry.location;
    const {
      details, userId, isVisible, loading,
    } = this.state;
    const { name } = details;

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
          <BarDetails
            id={id}
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
            name={name}
            lat={lat}
            lng={lng}
            id={id}
          />
        </ScrollView>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: COLORS.ACCENT_COLOR,
            marginBottom: 0,
            borderRadius: 0,
            width: Dimensions.get('window').width,
          }}
          textStyle={{ color: COLORS.TEXT_PRIMARY_COLOR }}
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
  containerContentStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loading: {
    paddingTop: 20,
  },
});

BarDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
