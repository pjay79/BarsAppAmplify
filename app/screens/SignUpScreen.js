import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Auth } from 'aws-amplify';
import Button from '../components/Button';
import Input from '../components/Input';
import * as COLORS from '../config/colors';

export default class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign Up',
    headerStyle: {
      backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
    },
    headerTintColor: COLORS.TEXT_PRIMARY_COLOR,
  };

  state = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    authCode: '',
    loading: false,
    error: '',
    status: '',
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  signUp = async () => {
    try {
      this.setState({ loading: true, error: '' });
      const {
        username, password, email, phoneNumber,
      } = this.state;
      if (username && password && email && phoneNumber) {
        const user = await Auth.signUp({
          username,
          password,
          attributes: {
            phone_number: phoneNumber,
            email,
          },
        });
        this.setState({ loading: false, status: 'User confirmation pending...' });
        console.log(user);
      } else {
        this.setState({ loading: false, error: 'Complete missing fields.' });
      }
    } catch (error) {
      this.setState({ loading: false, error: error.message });
      console.log(error.message);
    }
  };

  confirmSignUp = async () => {
    try {
      this.setState({ loading: true, error: '', status: '' });
      const { username, authCode } = this.state;
      if (authCode) {
        await Auth.confirmSignUp(username, authCode);
        this.setState({
          loading: false,
          status: 'Sign up successful!',
          username: '',
          email: '',
          phoneNumber: '',
          password: '',
          authCode: '',
        });
      } else {
        this.setState({ loading: false, error: 'Passcode is required.' });
      }
    } catch (error) {
      this.setState({ loading: false, error: error.message });
      console.log(error.message);
    }
  };

  render() {
    const {
      username, email, phoneNumber, password, authCode, loading, error, status,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
USERNAME:
        </Text>
        <Input
          placeholder="Bob"
          onChangeText={text => this.onChangeText('username', text)}
          value={username}
        />
        <Text style={styles.label}>
EMAIL:
        </Text>
        <Input
          placeholder="bob@gmail.com"
          onChangeText={text => this.onChangeText('email', text)}
          value={email}
        />
        <Text style={styles.label}>
PHONE NUMBER:
        </Text>
        <Input
          placeholder="+61XXXXXXXX"
          onChangeText={text => this.onChangeText('phoneNumber', text)}
          value={phoneNumber}
        />
        <Text style={styles.label}>
PASSWORD:
        </Text>
        <Input
          placeholder="********"
          onChangeText={text => this.onChangeText('password', text)}
          value={password}
          secureTextEntry
        />
        <Button
          title="SIGN UP"
          onPress={this.signUp}
          style={{ backgroundColor: COLORS.LIGHT_PRIMARY_COLOR }}
        />
        <View style={styles.verification}>
          <Text style={styles.label}>
ENTER VERIFICATION CODE HERE:
          </Text>
          <Input
            placeholder="******"
            onChangeText={text => this.onChangeText('authCode', text)}
            value={authCode}
          />
          <Button
            title="CONFIRM SIGN UP"
            onPress={this.confirmSignUp}
            style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 20 }}
          />
        </View>
        {loading && <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />}
        <Text style={error ? styles.error : styles.status}>
          {error}
          {status}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.DEFAULT_PRIMARY_COLOR,
  },
  verification: {
    marginTop: 40,
  },
  label: {
    alignSelf: 'flex-start',
    paddingLeft: '10%',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 10,
    color: COLORS.TEXT_PRIMARY_COLOR,
  },
  error: {
    marginTop: 10,
    paddingHorizontal: '10%',
    color: COLORS.PRIMARY_TEXT_COLOR,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
  status: {
    marginTop: 10,
    paddingHorizontal: '10%',
    color: COLORS.TEXT_PRIMARY_COLOR,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
});
