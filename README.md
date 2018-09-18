# BarsAppAmplify

React Native, AWS AppSync, AWS Amplify, AWS Cognito, GraphQL, DynamoDB.
Please note: this is a work still in progress, and many features are not fully developed yet.

## Screenshots

### iOS

## Technology stack:

- @mapbox/react-native-mapbox-gl
- aws-amplify
- aws-amplify-react-native
- aws-appsync
- aws-appsync-react
- aws-sdk
- axios
- geolib
- graphql-tag
- lodash
- moment
- prop-types
- react-apollo
- react-native-app-intro-slider
- react-native-config
- react-native-elements
- react-native-geolocation-service
- react-native-map-link
- react-native-modal
- react-native-splash-screen
- react-native-swipeout
- react-native-vector-icons
- react-navigation
- uuid

## Installation

### React Native setup:

`brew install node`  
`brew install watchman`  
`npm install -g react-native-cli`

And also install Xcode for iOS simulator + Android Studio / Genymotion for Android simulator. Alternatively connect up a hardware device.

### Project setup:

Clone the repo:
`git clone https://github.com/pjay79/BarsAppAmplify.git`  
Change to the project folder:
`cd BarsAppAmplify`  
Add dependencies:
`npm install` or `yarn`

### Amazon

Sign up to AWS Free Tier:  
https://aws.amazon.com/free/

### AWS Mobile CLI setup

(note: you will be directed to create a new **IAM** user and prompted to enter the **accessKeyId** and **secretAccessKey**, store these in a safe place):

`npm install -g awsmobile-cli`  
`awsmobile configure`  
`awsmobile init` (in the project folder)

![awsmobile2](https://user-images.githubusercontent.com/14052885/41520984-b04a9234-7313-11e8-9d6e-ead22f033725.jpeg)

`awsmobile user-signin enable`  
`awsmobile push`  
`awsmobile console` (opens the aws console in browser)

This project's source directory is 'app'.

### AWS AppSync setup:

In the aws console **Services** section locate **AWS AppSync** and then do the following:

- select **Create API**

![appsync-starter](https://user-images.githubusercontent.com/14052885/41519711-0afcbaf6-730d-11e8-87d8-255a19960345.jpeg)

- enter API name **AWS Movies App** and select authorization type to **Amazon Cognito User Pool**

![appsync-settings](https://user-images.githubusercontent.com/14052885/41507521-184374f2-7277-11e8-9b26-ab5d22a56ba3.jpeg)
![appsync-settings-userpool](https://user-images.githubusercontent.com/14052885/41507522-18768892-7277-11e8-9c6b-355653347db1.jpeg)

- select **Custom Schema**

Paste the following into the Custom Schema box:

```
type Movie {
    id: ID!
    title: String!
    genre: String!
    director: String!
    reviews: [Review]
    likes: Int!
    author: String!
    createdAt: String!
}

type Review {
    id: ID!
    movieID: ID!
    rating: Int!
    content: String!
    author: String!
    createdAt: String!
}

type Query {
    fetchMovie(id: ID!): Movie
}

schema {
    query: Query
}
```

Select **Save** and then **Create Resources**, then select type **Movie** with table name **MovieTable**. Repeat the same process for type **Review** with table name **ReviewTable**.

![create resources](https://user-images.githubusercontent.com/14052885/41507580-4a4fe6b4-7278-11e8-87c6-6dcfd3df5657.jpeg)

### Update resolvers

Back in the AppSync console, find the Data Type **Movie** and **attach** a resolver to the **reviews** field, it should look like this:

![resolver-reviews](https://user-images.githubusercontent.com/14052885/41519804-977471ea-730d-11e8-8abb-047845e242c9.jpeg)

Back again in the AppSync console, find the Data Type **Query** and modify resolver for the **listReviews** field, it should look like this:

![resolver-query](https://user-images.githubusercontent.com/14052885/41508261-38668d92-7285-11e8-9ba0-d2efd369eb22.jpeg)

### DynamoDB table index:

From your AppSync console:

- select **DataSources**
- select **ReviewTable**
- select **Create index** in DynamoDB
- select primary key **movieID**, and index name **movieID-index**
- set read and write capacity to 1 unit each

![create-index](https://user-images.githubusercontent.com/14052885/41519854-f0a4d624-730d-11e8-89cc-c1b3a1ea5348.jpeg)

![index-table](https://user-images.githubusercontent.com/14052885/41508128-1d491220-7283-11e8-9d08-2f581042fd48.jpeg)

### Add AppSync configuration

Download the React Native AppSync.js file:

![appsync-config](https://user-images.githubusercontent.com/14052885/41519914-43c0cfe8-730e-11e8-9ee8-4a0329ec2b12.jpeg)

Add the contents of this file to **app/aws-appsync.js** as follows:

```
export default {
    graphqlEndpoint: 'ENTER_ENDPOINT',
    region: 'ENTER_REGION',
    authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    apiKey: 'null',
};
```

### AWS Cognito

In the aws console **Services** section locate **Cognito** and select **Manage User Pools**. Here you can customise the user and authorisation settings. For this project **MFA** has been set to **OPTIONAL**.

![cognito-page](https://user-images.githubusercontent.com/14052885/41520257-1d1a67b2-7310-11e8-81a4-ae8696976e09.jpeg)

### Launch

Run on ios:
`react-native run-ios`  
Run on android:
`react-native run-android`
