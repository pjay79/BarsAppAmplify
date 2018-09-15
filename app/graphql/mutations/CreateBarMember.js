export default `
  mutation createBarMember($userId: ID!, $barId: ID!) {
    createBarMember(input: { userId: $userId, barId: $barId}) {
      id
      userId
      barId  
      __typename
    }
  }
`;
