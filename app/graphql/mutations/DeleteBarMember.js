export default `
  mutation deleteBarMember($id: ID!) {
    deleteBarMember(input: { id: $id }) {
      id
      userId
      barId
      __typename
    }
  }
`;
