export default `
  query getBar($id: ID!) {
    getBar(id: $id) {
      id
      name
      __typename
    }
  }
`;
