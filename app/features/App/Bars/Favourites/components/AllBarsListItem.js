// @flow
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import MapLinks from '../../../../../components/MapLinks';

// Config
import * as COLORS from '../../../../../config/colors';

// Types
type Props = {
  item: {
    id: string,
    name: string,
    phone: string,
    location: string,
    website: string,
    lat: string,
    lng: string,
    createdAt: string,
  },
  addToUserFavourites: Function,
  openWebsiteLink: Function,
  toggleMapLinks: Function,
  openPhone: Function,
  isVisible: boolean,
  adding: boolean,
};

const { width } = Dimensions.get('window');

const AllBarsListItem = ({
  item,
  addToUserFavourites,
  openWebsiteLink,
  toggleMapLinks,
  openPhone,
  isVisible,
  adding,
}: Props) => {
  const swipeoutBtns = [
    {
      backgroundColor: adding ? COLORS.DEFAULT_PRIMARY_COLOR : COLORS.ACCENT_COLOR,
      onPress: () => addToUserFavourites(item.id),
      text: adding ? <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} /> : 'LIKE',
    },
  ];
  const date = moment.utc(item.createdAt).format('MMMM Do YYYY, h:mm:ss a');
  return (
    <Swipeout right={swipeoutBtns} backgroundColor={COLORS.TEXT_PRIMARY_COLOR}>
      <View style={styles.card}>
        <View style={styles.details}>
          <Text style={styles.header}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
          <Text style={styles.date}>{`Added on ${date}`}</Text>
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => openWebsiteLink(item.website)}>
            <MaterialCommunityIcons name="web" size={18} color={COLORS.ACCENT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMapLinks}>
            <MaterialCommunityIcons name="directions" size={18} color={COLORS.DARK_PRIMARY_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPhone(item.phone)}>
            <Foundation name="telephone" size={18} color={COLORS.PRIMARY_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
        <MapLinks
          isVisible={isVisible}
          onCancelPressed={toggleMapLinks}
          onAppPressed={toggleMapLinks}
          onBackButtonPressed={toggleMapLinks}
          name={item.name}
          lat={parseFloat(item.lat)}
          lng={parseFloat(item.lng)}
          barId={item.id}
        />
      </View>
    </Swipeout>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width,
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
    fontSize: 10,
  },
  date: {
    fontSize: 10,
    color: COLORS.SECONDARY_TEXT_COLOR,
  },
  iconWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default AllBarsListItem;
