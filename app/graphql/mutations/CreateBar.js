export default `
  mutation createBar($id: ID!, $name: String!, $phone: AWSPhone, $location: String, $lat: String, $lng: String, $url: AWSURL, $addedBy: ID!) {
    createBar(input: { id: $id, name: $name, phone: $phone, location: $location, lat: $lat, lng: $lng, url: $url, addedBy: $addedBy }) {
      id
      createdAt
      updatedAt
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
