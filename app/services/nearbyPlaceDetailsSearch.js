import axios from 'axios';
import Config from 'react-native-config';

export default async (placeId: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=name,opening_hours/weekday_text,formatted_phone_number,vicinity,website,reviews,url,type&key=${
        Config.GOOGLE_PLACES_API_KEY
      }`,
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
