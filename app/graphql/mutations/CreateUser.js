export default `
  mutation createUser($id: ID!, $username: String!) {
    createUser(input: { id: $id, username: $username }) {
      id
      createdAt
      username
      __typename
    }
  }
`;
