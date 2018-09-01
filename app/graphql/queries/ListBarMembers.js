export default `
  query listBarMembers {
    listBarMembers {
        items {
          id
          createdAt
          updatedAt
          userId
          barId
          __typename
        }   
        __typename   
      }
    }
`;
