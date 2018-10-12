import axios from 'axios';
import Config from 'react-native-config';

export default async (latitude: string, longitude: string, pageToken: string) => {
  try {
    const urlFirst = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&rankBy=distance&type=bar&key=${
      Config.GOOGLE_PLACES_API_KEY
    }`;

    const urlNext = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&rankBy=distance&type=bar&key=${
      Config.GOOGLE_PLACES_API_KEY
    }&pagetoken=${pageToken}`;

    const url = pageToken === '' ? urlFirst : urlNext;
    const response = await axios.get(url);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
