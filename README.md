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

This app will have a many-to-many connection between type Bar and type User. Currently AWS Amplify does not yet support **_many-to-many connections_**, hence the **_@connection_** directive which is used for specifying relationships between **_@model_** object types cannot be used. Update the **_schema.graphql_** file to look as follows.

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

Note: AWS Amplify has has the following directives that can be used with AppSync:

> **_@model_**: Used for storing types in Amazon DynamoDB.

> **_@connection_**: Used to define different authorization strategies.

> **_@auth_**: Used for specifying relationships between @model object types.

> **_@searchable_**: Used for streaming the data of an @model object type to Amazon ElasticSearch Service.

## Important Step

`amplify push`

This command will update your cloud resources and add an **_aws-exports.js_** file to your **_project root directory_**. In your App.js file make sure this file is imported from the correct location. In my case, I had amplify cli placing this file within the **_app_** sub-directory. So you will have to edit the App.js file accordingly otherwise the app will not run.

## AWS AppSync

Go to the AWS Console and **_AWS AppSync_** under Services. Select the API that has been generated API for this app and go to the schema.

![schema](https://user-images.githubusercontent.com/14052885/45940494-c4501500-c01c-11e8-9683-a3f80fff0423.jpeg)

The schema that has been created needs some modification to allow for the many-to-many relationship between Bars and Users to work. Modify the schema as follows:

```
type Bar {
	id: ID!
	createdAt: String
	updatedAt: String
	name: String!
	phone: String
	location: String
	lat: String
	lng: String
	url: AWSURL
	website: AWSURL
	addedBy: ID!
	users(first: Int, after: String): BarUsersConnection
}

type BarMember {
	id: ID
	createdAt: String
	updatedAt: String
	userId: ID!
	barId: ID!
}

type BarUsersConnection {
	items: [User]
	nextToken: String
}

input CreateBarInput {
	id: ID!
	name: String!
	phone: String
	location: String
	lat: String
	lng: String
	url: AWSURL
	website: AWSURL
	addedBy: ID!
}

input CreateBarMemberInput {
	userId: ID!
	barId: ID!
}

input CreateUserInput {
	id: ID!
	username: String!
}

input DeleteBarInput {
	id: ID
}

input DeleteBarMemberInput {
	id: ID
}

input DeleteUserInput {
	id: ID
}

type ModelBarConnection {
	items: [Bar]
	nextToken: String
}

input ModelBarFilterInput {
	id: ModelIDFilterInput
	createdAt: ModelStringFilterInput
	name: ModelStringFilterInput
	phone: ModelStringFilterInput
	location: ModelStringFilterInput
	lat: ModelStringFilterInput
	lng: ModelStringFilterInput
	url: ModelStringFilterInput
	website: ModelStringFilterInput
	addedBy: ModelIDFilterInput
	and: [ModelBarFilterInput]
	or: [ModelBarFilterInput]
	not: ModelBarFilterInput
}

type ModelBarMemberConnection {
	items: [BarMember]
	nextToken: String
}

input ModelBarMemberFilterInput {
	id: ModelIDFilterInput
	createdAt: ModelStringFilterInput
	userId: ModelIDFilterInput
	barId: ModelIDFilterInput
	and: [ModelBarMemberFilterInput]
	or: [ModelBarMemberFilterInput]
	not: ModelBarMemberFilterInput
}

input ModelBooleanFilterInput {
	ne: Boolean
	eq: Boolean
}

input ModelFloatFilterInput {
	ne: Float
	eq: Float
	le: Float
	lt: Float
	ge: Float
	gt: Float
	contains: Float
	notContains: Float
	between: [Float]
}

input ModelIDFilterInput {
	ne: ID
	eq: ID
	le: ID
	lt: ID
	ge: ID
	gt: ID
	contains: ID
	notContains: ID
	between: [ID]
	beginsWith: ID
}

input ModelIntFilterInput {
	ne: Int
	eq: Int
	le: Int
	lt: Int
	ge: Int
	gt: Int
	contains: Int
	notContains: Int
	between: [Int]
}

enum ModelSortDirection {
	ASC
	DESC
}

input ModelStringFilterInput {
	ne: String
	eq: String
	le: String
	lt: String
	ge: String
	gt: String
	contains: String
	notContains: String
	between: [String]
	beginsWith: String
}

type ModelUserConnection {
	items: [User]
	nextToken: String
}

input ModelUserFilterInput {
	id: ModelIDFilterInput
	createdAt: ModelStringFilterInput
	username: ModelStringFilterInput
	and: [ModelUserFilterInput]
	or: [ModelUserFilterInput]
	not: ModelUserFilterInput
}

type Mutation {
	createBar(input: CreateBarInput!): Bar
	updateBar(input: UpdateBarInput!): Bar
	deleteBar(input: DeleteBarInput!): Bar
	createBarMember(input: CreateBarMemberInput!): BarMember
	updateBarMember(input: UpdateBarMemberInput!): BarMember
	deleteBarMember(input: DeleteBarMemberInput!): BarMember
	createUser(input: CreateUserInput!): User
	updateUser(input: UpdateUserInput!): User
	deleteUser(input: DeleteUserInput!): User
}

type Query {
	getBar(id: ID!): Bar
	listBars(filter: ModelBarFilterInput, limit: Int, nextToken: String): ModelBarConnection
	getBarMember(userId: ID!, barId: ID!): BarMember
	listBarMembers(filter: ModelBarMemberFilterInput, limit: Int, nextToken: String): ModelBarMemberConnection
	getUser(id: ID!): User
	listUsers(filter: ModelUserFilterInput, limit: Int, nextToken: String): ModelUserConnection
}

type Subscription {
	onCreateBar: Bar
		@aws_subscribe(mutations: ["createBar"])
	onUpdateBar: Bar
		@aws_subscribe(mutations: ["updateBar"])
	onDeleteBar: Bar
		@aws_subscribe(mutations: ["deleteBar"])
	onCreateBarMember: BarMember
		@aws_subscribe(mutations: ["createBarMember"])
	onUpdateBarMember: BarMember
		@aws_subscribe(mutations: ["updateBarMember"])
	onDeleteBarMember: BarMember
		@aws_subscribe(mutations: ["deleteBarMember"])
	onCreateUser: User
		@aws_subscribe(mutations: ["createUser"])
	onUpdateUser: User
		@aws_subscribe(mutations: ["updateUser"])
	onDeleteUser: User
		@aws_subscribe(mutations: ["deleteUser"])
}

input UpdateBarInput {
	id: ID!
	name: String
	phone: String
	location: String
	lat: String
	lng: String
	url: AWSURL
	website: AWSURL
}

input UpdateBarMemberInput {
	id: ID!
	userId: ID
	barId: ID
}

input UpdateUserInput {
	id: ID!
	username: String
}

type User {
	id: ID!
	createdAt: String
	updatedAt: String
	username: String!
	bars(first: Int, after: String): UserBarsConnection
}

type UserBarsConnection {
	items: [Bar]
	nextToken: String
}
```

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
`react-native run-ios --device "iPhone X"`

Run on android device:  
`adb devices`  
`react-native run-android --deviceId "myDeviceId"`

Run on ios:
`react-native run-ios`  
Run on android:
`react-native run-android`
