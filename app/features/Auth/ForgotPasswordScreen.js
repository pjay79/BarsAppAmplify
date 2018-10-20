import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Animated,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth } from 'aws-amplify';

// Components
import Button from '../../components/Button';
import Input from '../../components/Input';

// Config
import * as COLORS from '../../config/colors';
import { itemAnimation } from '../../config/animations';

// Types
type State = {
  username: string,
  password: string,
  authCode: string,
  loading: boolean,
  error: string,
  status: string,
};

export default class ForgotPasswordScreen extends PureComponent<void, State> {
  state = {
    username: '',
    password: '',
    authCode: '',
    loading: false,
    error: '',
    status: '',
  };

  animatedValue1 = new Animated.Value(0);

  animatedValue2 = new Animated.Value(0);

  animatedValue3 = new Animated.Value(0);

  animatedValue4 = new Animated.Value(0);

  animatedValue5 = new Animated.Value(0);

  componentDidMount() {
    this.animateSections();
  }

  animateSections = () => {
    Animated.sequence([
      itemAnimation(this.animatedValue1),
      itemAnimation(this.animatedValue2),
      itemAnimation(this.animatedValue3),
      itemAnimation(this.animatedValue4),
      itemAnimation(this.animatedValue5),
    ]).start();
  };

  onChangeText = (key: string, value: string) => {
    this.setState({ [key]: value });
  };

  resetPassword = async () => {
    try {
      this.setState({ loading: true, error: '' });
      const { username } = this.state;
      if (username) {
        const password = await Auth.forgotPassword(username);
        this.setState({ loading: false, status: 'Reset confirmation pending...' });
        console.log(password);
      } else {
        this.setState({ loading: false, error: 'Complete missing fields.' });
      }
    } catch (error) {
      this.setState({ loading: false, error: error.message });
      console.log(error.message);
    }
  };

  updatePassword = async () => {
    try {
      this.setState({ loading: true, error: '', status: '' });
      const { username, authCode, password } = this.state;
      if (username && authCode && password) {
        await Auth.forgotPasswordSubmit(username, authCode, password);
        this.setState({
          loading: false,
          status: 'Reset successful!',
          username: '',
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
      username, password, authCode, loading, error, status,
    } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} extraScrollHeight={20}>
        <Animated.View style={{ opacity: this.animatedValue1 }}>
          <Text style={styles.label}>Username:</Text>
          <Input
            placeholder="Enter username"
            onChangeText={text => this.onChangeText('username', text)}
            value={username}
          />
        </Animated.View>
        <Animated.View style={{ opacity: this.animatedValue2 }}>
          <Button
            title="RESET"
            onPress={this.resetPassword}
            style={{ backgroundColor: COLORS.LIGHT_PRIMARY_COLOR, marginTop: 10 }}
          />
        </Animated.View>
        <View style={styles.verification}>
          <Animated.View style={{ opacity: this.animatedValue3 }}>
            <Text style={[styles.label, { paddingLeft: 0 }]}>Enter verification code:</Text>
            <Input
              placeholder="******"
              onChangeText={text => this.onChangeText('authCode', text)}
              value={authCode}
            />
          </Animated.View>
          <Animated.View style={{ opacity: this.animatedValue4 }}>
            <Text style={[styles.label, { paddingLeft: 0 }]}>New password:</Text>
            <Input
              placeholder="********"
              onChangeText={text => this.onChangeText('password', text)}
              value={password}
              secureTextEntry
            />
          </Animated.View>
          <Animated.View style={{ opacity: this.animatedValue5 }}>
            <Button
              title="SUBMIT"
              onPress={this.updatePassword}
              style={{ backgroundColor: COLORS.ACCENT_COLOR, marginBottom: 20, marginTop: 10 }}
            />
          </Animated.View>
        </View>
        {loading && <ActivityIndicator color={COLORS.TEXT_PRIMARY_COLOR} />}
        <Text style={error ? styles.error : styles.status}>
          {error}
          {status}
        </Text>
      </KeyboardAwareScrollView>
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
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
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
