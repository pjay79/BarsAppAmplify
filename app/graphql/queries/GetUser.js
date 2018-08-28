export default `
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      __typename
    }
  }
`;
