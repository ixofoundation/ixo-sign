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

import {Ixo} from "ixo-module";

import * as Keychain from 'react-native-keychain';

import AuthModal from './src/AuthModal';

export default class TestSign extends Component<{}> {
  requestCode = 0


  constructor(props) {
    super(props);
    
    this.state = {
      text1: props.content,
      text: {message: 'This is a test'},
      username: '',
      password: '',
      service: TestSign._service,
      status: 'no key',
      sovrinDID: '',
      authenticate: false,
    };

    this._onAuthSuccess = this._onAuthSuccess.bind(this);
    this._onAuthCancel = this._onAuthCancel.bind(this);
  }

  signText() {
    const ixo = this.getIxo();
    const sovId = ixo.cryptoUtil.generateSovrinDID(this.state.password);
    var signature = ixo.cryptoUtil.getDocumentSignature(
      sovId.secret.signKey, sovId.verifyKey, this.state.text);

    console.log('bbb');
    var signDate = (new Date()).toJSON();
    var response = {
      content: this.state.text,
      signature: {
        type: "Ed25519",
        created: signDate,
        publicKey: "0x" + this.state.sovrinDID.verifyKey,
        creator: "0x" + this.state.sovrinDID.did,
        signature: "0x" + signature
      }
    };

    console.log(response);
    return response;
  }

  async onPress() {
    if (Platform.OS === 'ios') {
      console.warn('iOS is not currently supported.');
      return;
    }

    var response = this.signText();
    console.log('aaa');
    const { ActivityCompletion } = NativeModules;

    ActivityCompletion.finish(
      ActivityCompletion.OK,
      "com.ixosign.SIGNED",
      response);
  }

  static isString (value) {
    return typeof value === 'string' || value instanceof String;
  };

  getIxo(){
    //Hardcode in some text to sign
    const ixo = new Ixo("https://ixo-node.herokuapp.com");
    console.log('done ixo');
    return ixo;
  }

  static _service = 'IXOSTORE1zzdz';
  loadKey() {
    let usernameTemp = 'DID:foobar';
    let passwordTemp = 'abc123';
    const ixo = this.getIxo();

    console.log('generated DID');

    let credentialsTemp = {foo:'bar' };
    Keychain
      .getGenericPassword(TestSign._service)
      .then((credentials) => {
        if (credentials) {
          console.log('creds loaded for %s', credentials.username);
          console.log('creds loaded for %s', credentials.password);
          this.setState({ ...credentials, status: 'Credentials exist and loaded!' });
          return Promise.resolve(true);
        } else {
          // OK Nothing in the KeyStore
          // Need to generate new pair...
          this.setState({ status: 'No credentials stored.' });
          // Keychain library always returns string in android, bool in ios, regardless..
          console.log('gen creds');
          const mnemonic = ixo.cryptoUtil.generateMnemonic();
          const sovrinDID = ixo.cryptoUtil.generateSovrinDID(mnemonic);
          console.log('done gen creds');
          console.log("mn: %s", mnemonic);
          console.log(sovrinDID.did);
          credentialsTemp.username = sovrinDID.did;
          credentialsTemp.password = mnemonic;
          this.setState({ ...credentialsTemp, status: 'Credentials generated and loaded!' });
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
        console.log('set the credentials %s', this.state.username);

      })
      .catch((err) => {
        this.setState({ status: 'Could not load nor create credentials. ' + err });
      });
  }

  componentWillMount() {
    this.loadKey();
  }

  render() {
    console.log('cc1')
    if (!this.state.text) {
      return (
        <View style={styles.container}>
          <Text>Nothing to sign!!!</Text>
          <Text>{this.state.status}</Text>
        </View>
      );
    }

    let authModal;
    if (this.state.authenticate) {
      authModal = (
        <AuthModal
          onSuccess={this._onAuthSuccess}
          onCancel={this._onAuthCancel}
        />
      )
    }

    return (
      <View style={styles.container}>
        <TextInput
          style={{ width: '100%' }}
          value={ JSON.stringify(this.state.text) }
          onChangeText={text => this.setState({ text:text })} />
        <Button onPress={() => this.onPress()} title="Sign" />
        <Button onPress={() => this.setState({authenticate: true})} title="Login" />
        {authModal}
      </View>
    );
  }
  
  _onAuthSuccess() {
    this.setState({authenticate: false});
    alert('Success!');
  }

  _onAuthCancel() {
    this.setState({authenticate: false});
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
