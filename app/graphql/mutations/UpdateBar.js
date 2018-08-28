export default `
  mutation updateBar($id: ID!, $name: String, $phone: AWSPhone, $location: String, $lat: String, $lng: String, $url: AWSURL) {
    updateBar(input: { id: $id, name: $name, phone: $phone, location: $location, lat: $lat, lng: $lng, url: $url}) {
      id
      createdAt
      name
      phone
      location
      lat
      lng
      url
      addedBy
      __typename
    }
  }
`;
