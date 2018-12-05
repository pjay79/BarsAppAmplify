# BarsAppAmplify

React Native, AWS Amplify, AWS AppSync, AWS Cognito, Google Places, Mapbox. Please note: this is a work still in progress, and many features are not fully developed yet.

## Update 1st Dec 2018, MapBox has been removed from this app as Google Places API terms require data to be place on Google Maps only

## This app is being prepared for deployment

## ToDo

- enable offline support
- add pagination

## Folder structure:

![folder1-small](https://user-images.githubusercontent.com/14052885/45946797-56641780-c035-11e8-920b-3d2c8af1fedb.jpg)
![folder2-small](https://user-images.githubusercontent.com/14052885/45946798-56641780-c035-11e8-917e-ae34bc57a98e.jpg)

# Screenshots

## iOS

![img_3560](https://user-images.githubusercontent.com/14052885/45955616-c08bb500-c053-11e8-842f-8e1b6ce21780.PNG)
![img_3561](https://user-images.githubusercontent.com/14052885/45955618-c08bb500-c053-11e8-8981-c99c7a9ba2c9.PNG)
![img_3562](https://user-images.githubusercontent.com/14052885/45955619-c08bb500-c053-11e8-9b21-e32996e1f8a0.PNG)
![img_3563](https://user-images.githubusercontent.com/14052885/45955620-c1244b80-c053-11e8-9b7c-ac420ad5dfb1.PNG)
![img_3644](https://user-images.githubusercontent.com/14052885/46387674-28ed2d00-c70b-11e8-8f40-a429a7abad30.PNG)
![img_3616](https://user-images.githubusercontent.com/14052885/46045156-2c5b4400-c160-11e8-8d57-47a32827a2b4.PNG)
![img_3617](https://user-images.githubusercontent.com/14052885/46045158-2cf3da80-c160-11e8-9c4d-04ee170b3cbd.PNG)
![img_3596](https://user-images.githubusercontent.com/14052885/45955622-c1244b80-c053-11e8-8f1c-fcb306cc0af7.PNG)
![img_3598](https://user-images.githubusercontent.com/14052885/45955624-c1bce200-c053-11e8-8ad5-e4271cae6ee8.PNG)
![img_3599](https://user-images.githubusercontent.com/14052885/45955625-c1bce200-c053-11e8-90a7-56bde725150c.PNG)
![img_3600](https://user-images.githubusercontent.com/14052885/45955626-c2557880-c053-11e8-9df4-f84af0301503.PNG)
![img_3601](https://user-images.githubusercontent.com/14052885/45955627-c2557880-c053-11e8-83f7-e2fa2ecbc896.PNG)
![img_3602](https://user-images.githubusercontent.com/14052885/45955628-c2557880-c053-11e8-990f-27763dc604f7.PNG)
![img_3603](https://user-images.githubusercontent.com/14052885/45955629-c2ee0f00-c053-11e8-8de8-832e83bea7e5.PNG)
![img_3604](https://user-images.githubusercontent.com/14052885/45955630-c2ee0f00-c053-11e8-95ec-0c2ba3521942.PNG)
![img_3606](https://user-images.githubusercontent.com/14052885/45955631-c386a580-c053-11e8-9236-c5ab7564c1c2.PNG)
![img_3607](https://user-images.githubusercontent.com/14052885/45955633-c386a580-c053-11e8-9151-b23df5bd1bc5.PNG)
![img_3608](https://user-images.githubusercontent.com/14052885/45955634-c41f3c00-c053-11e8-8296-4054513351c5.PNG)

## Technology stack:

- @mapbox/react-native-mapbox-gl
- aws-amplify
- aws-amplify-react-native
- aws-appsync
- aws-appsync-react
- aws-sdk
- axios
- babel-plugin-transform-remove-console
- geolib
- graphql-tag
- lodash
- moment
- react-apollo
- react-native-app-intro-slider
- react-native-collapsible
- react-native-config
- react-native-elements
- react-native-geolocation-service
- react-native-keyboard-aware-scroll-view"
- react-native-map-link
- react-native-modal
- react-native-splash-screen
- react-native-swipeout
- react-native-vector-icons
- react-navigation
- uuid

# Installation

## React Native setup:

Install Node.js:  
https://nodejs.org/en/download/

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

`amplify add auth` (update: I have now set MFA to optional to get the password reset functionality working)

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

## Important Step

`amplify push`

This command will update your cloud resources and add an **_aws-exports.js_** file to your **_project root directory_**. In your App.js file make sure this file is imported from the correct location.

## Other directives

Note: AWS Amplify has has the following directives that can be used with AppSync:

> **_@model_**: Used for storing types in Amazon DynamoDB.

> **_@connection_**: Used to define different authorization strategies.

> **_@auth_**: Used for specifying relationships between @model object types.

> **_@searchable_**: Used for streaming the data of an @model object type to Amazon ElasticSearch Service.

## AWS AppSync Codegen

AWS Amplify can generate types, as well as query, mutation, and subscription files based on your schema. In this project you will not need to do this as the relevant files have already been created in this repository. See the video below for an example:

https://www.youtube.com/watch?v=r0PbwDoNMcY

## AWS AppSync Schema

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

## AWS AppSync Resolvers

### Resolver for Bar.users: BarMemberTable

```
## Request

{
    "version" : "2017-02-28",
    "operation" : "Query",
    "query" : {
        "expression": "barId = :id",
        "expressionValues" : {
            ":id" : {
                "S" : "${ctx.source.id}"
            }
        }
    },
    "index": "barId-index",
    "limit": $util.defaultIfNull(${ctx.args.first}, 20),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.after, null))
}
```

```
## Response

{
    "items": $util.toJson($ctx.result.items),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
}
```

### Resolver for BarUsersConnection.items: UserTable

```
## Request
## Please remember to replace the hyphenated table name below with the one that was created for your app

#set($ids = [])
#foreach($user in ${ctx.source.items})
    #set($map = {})
    $util.qr($map.put("id", $util.dynamodb.toString($user.get("userId"))))
    $util.qr($ids.add($map))
#end

{
    "version" : "2018-05-29",
    "operation" : "BatchGetItem",
    "tables" : {
        "User-rndmxxybyjfv5lvzou3767zbte": {
               "keys": $util.toJson($ids),
               "consistentRead": true
       }
    }
}
```

```
## Response
## Please remember to replace the hyphenated table name below with the one that was created for your app

#if( ! ${ctx.result.data} )
  $util.toJson([])
#else
  $util.toJson($ctx.result.data.User-uq7n63nywrc4tku2tzgx4mx75u)
#end
```

### Resolver for User.bars: BarMemberTable

```
## Request

{
    "version" : "2017-02-28",
    "operation" : "Query",
    "query" : {
        "expression": "userId = :id",
        "expressionValues" : {
            ":id" : {
                "S" : "${ctx.source.id}"
            }
        }
    },
    "index": "userId-index",
    "limit": $util.defaultIfNull(${ctx.args.first}, 20),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.after, null))
}
```

```
## Response

{
    "items": $util.toJson($ctx.result.items),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
}
```

### Resolver for UserBarsConnection.items: BarTable

```
## Request
## Please remember to replace the hyphenated table name below with the one that was created for your app


#set($ids = [])
#foreach($bar in ${ctx.source.items})
    #set($map = {})
    $util.qr($map.put("id", $util.dynamodb.toString($bar.get("barId"))))
    $util.qr($ids.add($map))
#end

{
    "version" : "2018-05-29",
    "operation" : "BatchGetItem",
    "tables" : {
        "Bar-rndmxxybyjfv5lvzou3767zbte": {
               "keys": $util.toJson($ids),
               "consistentRead": true
       }
    }
}
```

```
## Response
## Please remember to replace the hyphenated table name below with the one that was created for your app

#if( ! ${ctx.result.data} )
  $util.toJson([])
#else
  $util.toJson($ctx.result.data.Bar-uq7n63nywrc4tku2tzgx4mx75u)
#end
```

### Resolver for Query.getBarMember: BarMember

```
## Request

{
    "version" : "2017-02-28",
    "operation" : "Query",
    "index" : "userId-index",
    "query" : {
        ## Provide a query expression. **
        "expression": "userId = :userId",
        "expressionValues" : {
            ":userId" : $util.dynamodb.toDynamoDBJson($ctx.args.userId)
        }
    },
    "filter" : {
    	"expression" : "barId = :barId",
        "expressionValues" : {
            ":barId" : $util.dynamodb.toDynamoDBJson($ctx.args.barId)
        }
    },
}
```

```
## Response

#if($ctx.result.items.size() > 0)
  $util.toJson($ctx.result.items[0])
#else
  null
#end
```

### Resolver for Mutation.createBar: BarTable

Update the key only, leave the rest as it is.

```
"key": {
  "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
},
```

### Resolver for Mutation.createUser: UserTable

Update the key only, leave the rest as it is.

```
"key": {
  "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
},
```

## DynamoDB

From the AWS AppSync console select **_Data Sources_** and find the **_BarMember_** table. Create 2 indexes for this table, **_barId-index_**, and **_userId-index_**, with no sort keys and default settings. See example below:

![create-index](https://user-images.githubusercontent.com/14052885/45951609-6dac0080-c047-11e8-870a-83f621c181d5.jpeg)

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

If you are getting build errors try the following:

- rebuild
- delete app from simulator or device and rebuild
- erase all content and settings from simulator and rebuild
- clean build folder in xcode and rebuild
- `rm -rf ~/.rncache`
- `rm -rf node_modules && rm -rf ~/.rncache && yarn`

If you are getting any yellow box warnings when entering text into the SearchBar, disable remote debugging.

## Flow

I am in the process of migrating from PropTypes to using Flow. To check for Flow errors:

`yarn run flow start`  
`yarn run flow status`

## Testing with Jest and Enzyme

I have started adding tests using Jest and Enzyme. To check the current tests are working:

`yarn run test`

# Additional information

## React Apollo

In this app I have chosen to primarily use React Apollo's graphql **_higher order component_** to connect queries, mutations, and subscriptions to the app. With React Apollo 2.1 you can use the new **_Query, Mutation, and Subscription_** components instead.

## AWS Amplify API

In the Auth section of this app I have used AWS Amplify's API and **_graphqlOperation_** helper. This API is effectively an alternative GraphQL client for working with queries, mutations, and subscriptions. It is great to use when you do not need offline support and the more advanced features of React Apollo.

## AWS Appsync

With AWS AppSync you can combine React Apollo's graphql higher order component with the **_graphqlMutation_** (offline support) and **_buildSubscription_** helpers. These take away some of the boilerplate code normally required to implement mutations and subscriptions. I have used the buildSubscription helper in this app.
