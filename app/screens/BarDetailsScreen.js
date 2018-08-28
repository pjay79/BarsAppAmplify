import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import Auth from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Popup } from 'react-native-map-link';
import axios from 'axios';
import Config from 'react-native-config';
import GetBar from '../graphql/queries/GetBar';
import CreateBar from '../graphql/mutations/CreateBar';
import UpdateBar from '../graphql/mutations/UpdateBar';
import CreateBarMember from '../graphql/mutations/CreateBarMember';
import Button from '../components/Button';
import * as COLORS from '../config/colors';

export default class BarDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('bar').name,
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  });

  state = {
    details: {},
    isVisible: false,
    loading: false,
  };

  componentDidMount() {
    this.getBarDetails();
  }

  getBarDetails = async () => {
    try {
      this.setState({ loading: true });
      const { navigation } = this.props;
      const placeId = navigation.getParam('bar').place_id;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=name,opening_hours/weekday_text,formatted_phone_number,vicinity,website,url,photo,type&key=${
          Config.GOOGLE_PLACES_API_KEY
        }`,
      );

      this.setState({ details: response.data.result });
      console.log(response);
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  addToFavourites = async () => {
    try {
      this.setState({ loading: true });
      const currentUser = await Auth.currentAuthenticatedUser();
      const addedBy = currentUser.signInUserSession.accessToken.payload.sub;

      const { navigation } = this.props;
      const id = navigation.getParam('bar').place_id;
      const { lat, lng } = navigation.getParam('bar').geometry.location;

      const { details } = this.state;
      const { name, url } = details;
      const phone = details.formatted_phone_number;
      const location = details.vicinity;

      const barData = {
        id,
        name,
        phone,
        location,
        lat,
        lng,
        url,
        addedBy,
      };
      const addedBar = await API.graphql(graphqlOperation(GetBar, { id }));
      console.log(addedBar);
      if (!addedBar.data.getBar) {
        await API.graphql(graphqlOperation(CreateBar, barData));
      } else {
        await API.graphql(graphqlOperation(UpdateBar, { id }));
      }
      this.addToUserFavourites(addedBy, id);
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  addToUserFavourites = async (userId, barId) => {
    try {
      await API.graphql(graphqlOperation(CreateBarMember, { userId, barId }));
    } catch (error) {
      console.log(error);
    }
  };

  showMapLinks = () => {
    this.setState({ isVisible: true });
  };

  render() {
    const { navigation } = this.props;
    const id = navigation.getParam('bar').place_id;
    const { lat, lng } = navigation.getParam('bar').geometry.location;

    const { details, isVisible, loading } = this.state;
    const { name, vicinity } = details;
    const formattedPhoneNumber = details.formatted_phone_number;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>
            {name}
          </Text>
          <Text>
            {formattedPhoneNumber}
          </Text>
          <Text>
            {vicinity}
          </Text>
          <Popup
            isVisible={isVisible}
            onCancelPressed={() => this.setState({ isVisible: false })}
            onAppPressed={() => this.setState({ isVisible: false })}
            onBackButtonPressed={() => this.setState({ isVisible: false })}
            modalProps={{
              // you can put all react-native-modal props inside.
              animationIn: 'slideInUp',
            }}
            appsWhiteList={[
              'apple-maps',
              'google-maps',
              'uber',
              'waze',
              'lyft',
              'transit',
              'yandex',
              'moovit',
              'citymapper',
            ]}
            options={{
              /* See `showLocation` method above, this accepts the same options. */
              title: name,
              latitude: lat,
              longitude: lng,
              googlePlaceId: id,
              dialogTitle: 'Directions',
              dialogMessage: 'Open bar location in one of the following apps:',
              cancelText: 'Cancel',
            }}
            style={
              {
                /* Optional: you can override default style by passing your values. */
              }
            }
          />
          <Button
            title="Add to Favourites"
            onPress={this.addToFavourites}
            style={{ backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR, marginTop: 10 }}
            textStyle={{ color: COLORS.TEXT_PRIMARY_COLOR }}
          />
        </View>
        {loading && <ActivityIndicator color={COLORS.PRIMARY_TEXT_COLOR} />}
        <Button
          title="Open in Maps"
          onPress={this.showMapLinks}
          style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 10 }}
          textStyle={{ color: COLORS.TEXT_PRIMARY_COLOR }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
});

BarDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
