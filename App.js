import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import codePush from 'react-native-code-push';
import awsConfig from './aws-exports';

// Features
import MainNavigator from './app/features/MainNavigator';

// Amplify Configuration
Amplify.configure(awsConfig);

const client = new AWSAppSyncClient({
  url: awsConfig.aws_appsync_graphqlEndpoint,
  region: awsConfig.aws_appsync_region,
  auth: {
    type: awsConfig.aws_appsync_authenticationType,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
  disableOffline: true,
});

const App = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <MainNavigator />
    </Rehydrated>
  </ApolloProvider>
);

export default codePush(App);
