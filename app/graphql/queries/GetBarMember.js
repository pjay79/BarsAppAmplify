export default `
  query getBarMember($userId: ID!, $barId: ID!) {
    getBarMember(userId: $userId, barId: $barId) {
      id
      userId
      barId
      __typename
    }
  }
`;
