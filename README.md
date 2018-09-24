# BarsAppAmplify

React Native, AWS AppSync, AWS Amplify, AWS Cognito, GraphQL, DynamoDB.
Please note: this is a work still in progress, and many features are not fully developed yet.

## ToDo

- enable offline support
- add search
- add pagination
- add Geolocation.watchPosition to Nearyby Bars (ListScreen and MapScreen)
- add alternative to SegmentControlIOS for android

## Issues

- refetchQuery does not work when UserBarsList is empty, requires refetch to load first items, but seems to work thereafter
- subscription for AllBarsList works intermittently, sometimes refetch required when AllBarsList is empty, disabling remote debugging seems to help, and occasionally getting metro bundler error that may be associated with this ('Error: not opened at WebSocket.send')
- MapboxGL not working on android

# Screenshots

## iOS

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

# Installation

## React Native setup:

`brew install node`  
`brew install watchman`  
`npm install -g react-native-cli`

And also install Xcode for iOS simulator + Android Studio / Genymotion for Android simulator. Preferably connect up a hardware device for this particular app to access geolocation, maps + directions, and phone connection.

## Project setup:

Clone the repo:
`git clone https://github.com/pjay79/BarsAppAmplify.git`  
Change to the project folder:
`cd BarsAppAmplify`  
Add dependencies:
`npm install` or `yarn`

### Amazon

Sign up to AWS Free Tier:  
https://aws.amazon.com/free/

### AWS Amplify CLI setup

`npm install -g @aws-amplify/cli`

`amplify configure`

This command will direct you to create a new **IAM** user, when prompted enter the **accessKeyId** and **secretAccessKey**, store these in a safe place, you can also assign this user an AWS Profile Name:

![amplify-cropped](https://user-images.githubusercontent.com/14052885/45936158-a53e8c80-bff6-11e8-9b85-81cc4557fb44.jpg)

`amplify init` (in the project folder)

![amplify-init-cropped](https://user-images.githubusercontent.com/14052885/45936167-c3a48800-bff6-11e8-85c1-aaf17281f20d.jpg)

`amplify add auth`

![amplify-auth](https://user-images.githubusercontent.com/14052885/45937057-5eee2b00-c000-11e8-9672-6e24d689d88b.jpeg)

`amplify add api`

![amplify-api-setup](https://user-images.githubusercontent.com/14052885/45937062-61e91b80-c000-11e8-908c-826c56cb5741.jpeg)

The base **_schema.graphql_** file looks like this:

```
type Bar @model {
	id: ID!
	title: String!
	content: String!
	price: Int
	rating: Float
}
```

Currently AWS Amplify does not yet support many-to-many connections, hence the **_@connection_** directive which is used for specifying relationships between **_@model_** object types cannot be used. Update the **_schema.graphql_** file to look as follows.

```
type Bar @model {
  id: ID!
  createdAt: String
  updatedAt: String
  name: String!
  phone: String
  location: String
  lat: String
  lng: String
  url: AWSURL
  addedBy: ID!
  users(first: Int, after: String): [Bar]
}

type BarMember @model {
  id: ID!
  createdAt: String
  updatedAt: String
  userId: ID!
  barId: ID!
}

type User @model {
  id: ID!
  createdAt: String
  updatedAt: String
  username: String!
  bars(first: Int, after: String): [Bar]
}
```

`amplify push`

This command will update your cloud resources.

## Google Places API

Sign up to **_Google Places_** and get an API key.

![google-places](https://user-images.githubusercontent.com/14052885/45939122-6d920d80-c013-11e8-8c2e-e48354b2c998.jpeg)

## Mapbox API

Sign up to **_Mapbox_** and get an API key.

![mapbox](https://user-images.githubusercontent.com/14052885/45939123-6ff46780-c013-11e8-9519-c5bb57452869.jpeg)

## Add API keys

This project uses **_react-native-config_** to store API keys in an environment file. Creata a **_.env_** file in the project root directory, then add your Google Places API and Mapbox API keys here.

```
GOOGLE_PLACES_API_KEY=YOUR_KEY_GOES_HERE
MAPBOX_ACCESS_TOKEN=YOUR_KEY_GOES_HERE
```

## Launch

Run on ios device:  
`react-native run-ios --device "iPhone"`

Run on android device:  
`adb devices`  
`react-native run-android --deviceId "myDeviceId"`

Run on ios:
`react-native run-ios`  
Run on android:
`react-native run-android`
