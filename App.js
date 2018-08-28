/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import MainNavigator from './app/routes/MainNavigator';

import awsConfig from './app/aws-exports';

Amplify.configure(awsConfig);

const client = new AWSAppSyncClient({
  url: awsConfig.aws_appsync_graphqlEndpoint,
  region: awsConfig.aws_appsync_region,
  auth: {
    type: awsConfig.aws_appsync_authenticationType,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
});

const App = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <MainNavigator />
    </Rehydrated>
  </ApolloProvider>
);

export default App;
