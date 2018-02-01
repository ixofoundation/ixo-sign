import React, { Component } from 'react';
import {
  Button,
  NativeModules,
  Platform,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';

import * as Keychain from 'react-native-keychain';

export default class TestSign extends Component<{}> {
  requestCode = 0


  constructor(props) {
    super(props);
    this.state = {
      text: props.content,
      username: '',
      password: '',
      service: TestSign._service,
      status: 'no key',
    };

  }

  async onPress() {
    if (Platform.OS === 'ios') {
      console.warn('iOS is not currently supported.');
      return;
    }

    const { ActivityCompletion } = NativeModules;

    ActivityCompletion.finish(
      ActivityCompletion.OK,
      "com.ixosign.SIGNED",
      { content: this.state.text });
  }

  static isString (value) {
    return typeof value === 'string' || value instanceof String;
  };

  static _service = 'IXOSTORE';
  loadKey() {
    let usernameTemp = 'DID:foobar';
    let passwordTemp = 'abc123';
    credentialsTemp = { username: usernameTemp, password: passwordTemp };
    Keychain
      .getGenericPassword(TestSign._service)
      .then((credentials) => {
        if (credentials) {
          return Promise.resolve(true);
        } else {
          this.setState({ status: 'No credentials stored.' });
          // Keychain library always returns string in android, bool in ios, regardless..  
          return Keychain.setGenericPassword(credentialsTemp.username, credentialsTemp.password, TestSign._service);
        }
      }).then((result) => {
        //already set, but Promise is defined in 'd.ts' file ios as bool; android as string.
        // on iOS this is true, on android it's a string when OK....
        if (result === true){
          return Promise.resolve(credentialsTemp);
        }
        if (TestSign.isString(result)){
          return Promise.resolve(credentialsTemp);
        }
        console.log('failed on getGenericPassword');
        return Promise.reject('failed on getGenericPassword');
      })
      .then(credentials => {
        console.log('set the credentials %s', JSON.stringify(credentials));
        this.setState({ ...credentials, status: 'Credentials loaded!' });
      })
      .catch((err) => {
        this.setState({ status: 'Could not load nor create credentials. ' + err });
      });
  }

  componentWillMount() {
    this.loadKey();
  }

  render() {
    if (!this.props.content) {
      return (
        <View style={styles.container}>
          <Text>Nothing to sign!!!</Text>
          <Text>{this.state.status}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput
          style={{ width: '100%' }}
          value={this.state.text}
          onChangeText={text => this.setState({ text: text })} />
        <Button onPress={() => this.onPress()} title="Sign" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
