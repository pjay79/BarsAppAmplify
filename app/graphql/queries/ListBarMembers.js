export default `
  query listBarMembers {
    listBarMembers {
        items {
          id
          userId
          barId
          __typename
        }   
        __typename   
      }
    }
`;
