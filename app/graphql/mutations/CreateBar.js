export default `
  mutation createBar($id: ID!, $name: String!, $phone: String, $location: String, $lat: String, $lng: String, $url: AWSURL, $website: AWSURL, $addedBy: ID!) {
    createBar(input: { id: $id, name: $name, phone: $phone, location: $location, lat: $lat, lng: $lng, url: $url, website: $website, addedBy: $addedBy }) {
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
