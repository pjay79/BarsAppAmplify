export default `
  query listBars {
    listBars {
        items {
          id
          createdAt
          name
          phone
          location
          lat
          lng
          url
          addedBy
          __typename
        }   
        __typename   
      }
    }
`;
