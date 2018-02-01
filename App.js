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
  static _service = 'IXOSTORE22';

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

  loadKey() {
    Keychain
      .getGenericPassword(TestSign._service)
      .then((credentials) => {
        if (credentials) {
          console.log(JSON.stringify(credentials));
          this.setState({ ...credentials, status: 'Credentials loaded!' });
          return Promise.resolve(true);
        } else {
          this.setState({ status: 'No credentials stored.' });

          // Keychain library always returns fales, regardless..  
          debugger;
          Keychain.setGenericPassword('DID:xxxx', 'PK....', TestSign._service);
        }
      })
      .then( credentialSet => {
        console.log('set the credentials %s', credentialSet === true);
      })
      .catch((err) => {
        this.setState({ status: 'Could not load nor create credentials. ' + err });
      });
  }

  componentWillMount(){
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
          style={{width: '100%'}}
          value={this.state.text} 
          onChangeText={text => this.setState({text: text})} />
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
