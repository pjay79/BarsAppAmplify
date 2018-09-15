export default `
  mutation updateBar($id: ID!, $name: String, $phone: String, $location: String, $lat: String, $lng: String, $url: AWSURL, $website: AWSURL) {
    updateBar(input: { id: $id, name: $name, phone: $phone, location: $location, lat: $lat, lng: $lng, url: $url, website: $website}) {
      id
      createdAt
      updatedAt
      name
      phone
      location
      lat
      lng
      url
      website
      addedBy
      __typename
    }
  }
`;
